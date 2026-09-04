# 09 — Autenticação e autorização

## Modelo
JWT access token curto (ex.: 10–15 min) + refresh token rotacionável. Refresh token persistido somente como hash e revogável.

## Fluxo
1. Login valida tenant/email/senha.
2. Emite access token com `sub`, `tenant_id`, role/permissions mínimas e `jti`.
3. Emite refresh token aleatório de alta entropia.
4. Refresh rotaciona token; reuse de token revogado pode encerrar a cadeia.
5. Logout revoga refresh atual/sessão.

## Roles iniciais
- Owner: administração total do tenant.
- Admin: gestão operacional e configuração, sem ações reservadas ao owner quando definido.
- Analyst: leitura e operações comerciais limitadas.
- SupportReadOnly: leitura operacional sem mutações financeiras.

## Permissions
Exemplos: `dashboard.read`, `products.read`, `products.write`, `customers.read`, `customers.write`, `orders.read`, `orders.write`, `transactions.read`, `transactions.refund`, `payment_links.write`, `checkout_settings.write`, `users.manage`, `webhooks.manage`, `audit.read`.

## Backend
Policies/authorization handlers verificam permission + tenant. Nunca confiar em role enviada pelo cliente.

## Frontend
Guard evita navegação indevida; directive/helper controla visibilidade de ações. Mesmo assim, endpoint pode retornar 403 e UI precisa tratar.

## Senhas
Mínimo definido por política, bloqueio/rate limit progressivo de login, hash forte e comparação segura. Nunca logar senha.

## Recuperação de senha
Pode ficar pós-MVP; quando implementada, token one-time com hash, expiração curta e invalidação após uso.
