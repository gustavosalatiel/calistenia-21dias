import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const WEBHOOK_TOKEN = Deno.env.get('KIWIFY_WEBHOOK_TOKEN') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// Product ID → access flags mapping (configure via env or hardcode)
// Format: PRODUCT_ID:nutrition,sleep,presidential
// Example: "PRD_ABC123:nutrition,sleep,presidential"
function getProductFlags(productId: string): Record<string, boolean> {
  const raw = Deno.env.get('KIWIFY_PRODUCT_MAP') ?? ''
  if (raw && productId) {
    for (const entry of raw.split('|')) {
      const colonIdx = entry.indexOf(':')
      if (colonIdx === -1) continue // entrada mal formatada — ignora
      const id = entry.substring(0, colonIdx).trim()
      const flags = entry.substring(colonIdx + 1).trim()
      if (id === productId.trim()) {
        return {
          nutrition_approved: flags.includes('nutrition'),
          sleep_approved: flags.includes('sleep'),
          presidential_approved: flags.includes('presidential'),
        }
      }
    }
  }
  // Default: libera tudo (produto não encontrado no mapa ou mapa vazio)
  return {
    nutrition_approved: true,
    sleep_approved: true,
    presidential_approved: true,
  }
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
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  console.log('[kiwify-webhook] Received:', JSON.stringify(body, null, 2))

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
    body.data?.buyer?.email ??
    body.buyer_email ??
    body.email ??
    ''
  ).toLowerCase().trim()
  const productId: string = body.data?.product?.id ?? body.product_id ?? ''

  if (!buyerEmail) {
    console.error('[kiwify-webhook] Missing buyer email')
    return new Response(JSON.stringify({ error: 'Missing buyer email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // APPROVED: add user
  if (APPROVED_EVENTS.has(event)) {
    const flags = getProductFlags(productId)
    console.log(`[kiwify-webhook] Approving ${buyerEmail} with flags:`, flags)

    const { error } = await supabase
      .from('app_approved')
      .upsert(
        { email: buyerEmail, ...flags },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (error) {
      console.error('[kiwify-webhook] DB error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ success: true, action: 'approved', email: buyerEmail, flags }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // REVOKED: remove user
  if (REVOKE_EVENTS.has(event)) {
    console.log(`[kiwify-webhook] Revoking ${buyerEmail} due to: ${event}`)

    const { error } = await supabase
      .from('app_approved')
      .delete()
      .eq('email', buyerEmail)

    if (error) {
      console.error('[kiwify-webhook] DB error on revoke:', error)
    }

    return new Response(
      JSON.stringify({ success: true, action: 'revoked', email: buyerEmail }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Unhandled event — still return 200 so Kiwify doesn't retry
  console.log(`[kiwify-webhook] Unhandled event: ${event}`)
  return new Response(
    JSON.stringify({ received: true, event }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
