import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const WEBHOOK_TOKEN = Deno.env.get('KIWIFY_WEBHOOK_TOKEN') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// KIWIFY_PRODUCT_MAP format: "PRODUCT_ID:flag1,flag2|PRODUCT_ID2:flag3"
// Flags: platform, nutrition, sleep, presidential
// "platform" = produto principal → apenas libera acesso base (insere na tabela)
function getProductInfo(productId: string): { known: boolean; flags: Partial<Record<string, boolean>> } {
  const raw = Deno.env.get('KIWIFY_PRODUCT_MAP') ?? ''
  if (raw && productId) {
    for (const entry of raw.split('|')) {
      const colonIdx = entry.indexOf(':')
      if (colonIdx === -1) continue
      const id = entry.substring(0, colonIdx).trim()
      const flagStr = entry.substring(colonIdx + 1).trim()
      if (id === productId.trim()) {
        return {
          known: true,
          flags: {
            nutrition_approved: flagStr.includes('nutrition'),
            sleep_approved: flagStr.includes('sleep'),
            presidential_approved: flagStr.includes('presidential'),
          },
        }
      }
    }
  }
  return { known: false, flags: {} }
}

const APPROVED_EVENTS = new Set([
  'order_approved', 'order.approved', 'order.paid',
  'subscription_active', 'subscription_renewed',
])
const REVOKE_EVENTS = new Set([
  'order_refunded', 'order.refunded',
  'order_canceled', 'order.canceled',
  'subscription_canceled', 'subscription_expired',
  'subscription_overdue',
])

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let body: any
  try { body = await req.json() }
  catch { return new Response('Invalid JSON', { status: 400 }) }

  console.log('[kiwify-webhook] Event:', body.event, '| Product:', body.data?.product?.id)

  // Token validation
  if (WEBHOOK_TOKEN) {
    const receivedToken = body.token ?? req.headers.get('x-kiwify-token') ?? ''
    if (receivedToken !== WEBHOOK_TOKEN) {
      console.error('[kiwify-webhook] Invalid token')
      return new Response('Unauthorized', { status: 401 })
    }
  }

  const event: string = body.event ?? ''
  const buyerEmail: string = (
    body.data?.buyer?.email ?? body.buyer_email ?? body.email ?? ''
  ).toLowerCase().trim()
  const productId: string = body.data?.product?.id ?? body.product_id ?? ''

  if (!buyerEmail) {
    return new Response(JSON.stringify({ error: 'Missing buyer email' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // ── APROVADO ──────────────────────────────────────────
  if (APPROVED_EVENTS.has(event)) {
    const { known, flags } = getProductInfo(productId)

    if (!known) {
      console.log(`[kiwify-webhook] Product ${productId} not in map — ignoring`)
      return new Response(JSON.stringify({ received: true, event }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verifica se já existe registro para esse email
    const { data: existing } = await supabase
      .from('app_approved')
      .select('*')
      .eq('email', buyerEmail)
      .single()

    if (existing) {
      // Atualiza somente os campos que devem ser ativados (não apaga outros)
      const updateFields: Record<string, boolean> = {}
      for (const [k, v] of Object.entries(flags)) {
        if (v) updateFields[k] = true
      }
      if (Object.keys(updateFields).length > 0) {
        await supabase.from('app_approved').update(updateFields).eq('email', buyerEmail)
      }
    } else {
      // Novo registro — produto principal: acesso base sem módulos extras
      await supabase.from('app_approved').insert({
        email: buyerEmail,
        nutrition_approved: flags.nutrition_approved ?? false,
        sleep_approved: flags.sleep_approved ?? false,
        presidential_approved: flags.presidential_approved ?? false,
      })
    }

    console.log(`[kiwify-webhook] ✅ Access granted: ${buyerEmail}`, flags)
    return new Response(
      JSON.stringify({ success: true, action: 'approved', email: buyerEmail, flags }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // ── REVOGADO ──────────────────────────────────────────
  if (REVOKE_EVENTS.has(event)) {
    const { known } = getProductInfo(productId)

    // Só remove totalmente se for o produto principal
    if (known) {
      await supabase.from('app_approved').delete().eq('email', buyerEmail)
      console.log(`[kiwify-webhook] ❌ Access revoked: ${buyerEmail}`)
    }

    return new Response(
      JSON.stringify({ success: true, action: 'revoked', email: buyerEmail }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ received: true, event }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
