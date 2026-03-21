# Configuração do Webhook Kiwify → Supabase

## 1. Instalar Supabase CLI

```bash
npm install -g supabase
```

## 2. Login no Supabase

```bash
supabase login
supabase link --project-ref lsfbjcjmybdamchendow
```

## 3. Configurar variáveis de ambiente no Supabase

No painel do Supabase → Settings → Edge Functions → Environment Variables, adicione:

| Variável | Valor |
|----------|-------|
| `KIWIFY_WEBHOOK_TOKEN` | Token secreto (você define, ex: `meu-token-secreto-123`) |
| `KIWIFY_PRODUCT_MAP` | Mapeamento de produtos (ver abaixo) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role (Settings → API → service_role) |

### Formato do KIWIFY_PRODUCT_MAP

Mapeia IDs de produto Kiwify para as flags de acesso:

```
PRD_AAAAA111:nutrition,sleep,presidential|PRD_BBBBB222:nutrition|PRD_CCCCC333:sleep
```

- Separar múltiplos produtos com `|`
- Flags disponíveis: `nutrition`, `sleep`, `presidential`
- Se o produto não estiver no mapa, libera TUDO por padrão

**Exemplo real:**
- Produto principal (dá acesso completo): `PRD_MAIN:nutrition,sleep,presidential`
- Só Nutrição: `PRD_NUT:nutrition`

Se tiver só UM produto que dá acesso completo, deixe `KIWIFY_PRODUCT_MAP` vazio — vai liberar tudo automaticamente.

## 4. Deploy da Edge Function

```bash
supabase functions deploy kiwify-webhook --no-verify-jwt
```

A URL do webhook será:
```
https://lsfbjcjmybdamchendow.supabase.co/functions/v1/kiwify-webhook
```

## 5. Configurar webhook na Kiwify

1. Acesse sua conta Kiwify → Produto → Configurações → Webhooks
2. Adicione a URL: `https://lsfbjcjmybdamchendow.supabase.co/functions/v1/kiwify-webhook`
3. Em "Token de autenticação", coloque o mesmo valor do `KIWIFY_WEBHOOK_TOKEN`
4. Selecione os eventos:
   - ✅ `order_approved` (compra aprovada)
   - ✅ `order_refunded` (reembolso)
   - ✅ `order_canceled` (cancelamento)
   - ✅ `subscription_canceled` (cancelamento de assinatura)

## 6. Testar o webhook

### Teste manual com curl:
```bash
curl -X POST https://lsfbjcjmybdamchendow.supabase.co/functions/v1/kiwify-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order_approved",
    "token": "SEU_TOKEN_AQUI",
    "data": {
      "buyer": { "email": "teste@exemplo.com" },
      "product": { "id": "PRD_MAIN" },
      "order": { "id": "ORD_TESTE", "status": "paid" }
    }
  }'
```

Resposta esperada:
```json
{ "success": true, "action": "approved", "email": "teste@exemplo.com", "flags": { "nutrition_approved": true, "sleep_approved": true, "presidential_approved": true } }
```

### Verificar no Supabase:
- Painel Supabase → Table Editor → `app_approved`
- O email `teste@exemplo.com` deve aparecer com todas as flags `true`

## 7. Como funciona o fluxo completo

```
Cliente compra na Kiwify
        ↓
Kiwify dispara webhook POST
        ↓
Edge Function valida token
        ↓
Extrai email + produto
        ↓
Upsert na tabela app_approved
        ↓
Cliente entra no app com o email
        ↓
Login verificado ✅ — acesso liberado!
```

## Eventos tratados

| Evento Kiwify | Ação no App |
|---------------|-------------|
| `order_approved` | ✅ Adiciona usuário |
| `subscription_active` | ✅ Adiciona usuário |
| `subscription_renewed` | ✅ Renova acesso |
| `order_refunded` | ❌ Remove usuário |
| `order_canceled` | ❌ Remove usuário |
| `subscription_canceled` | ❌ Remove usuário |
| `subscription_expired` | ❌ Remove usuário |
