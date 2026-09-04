# 14 — Ambientes e configuração

## Ambientes
- local: Docker Compose e mocks.
- test: efêmero no CI, database isolado.
- staging: semelhante a produção, dados fictícios.
- production/demo: ambiente público de portfólio, somente gateway mock.

## Variáveis backend
Exemplo `.env.example`:
```env
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__Default=Host=localhost;Port=5432;Database=payflow;Username=payflow;Password=CHANGE_ME
Jwt__Issuer=payflow-api
Jwt__Audience=payflow-web
Jwt__SigningKey=CHANGE_ME_MIN_32_CHARS
Frontend__AdminUrl=http://localhost:4200
Frontend__CheckoutUrl=http://localhost:4300
Webhook__EncryptionKey=CHANGE_ME
```
Não usar os valores de exemplo em produção.

## Frontend
Usar configuração build/runtime sem secret. `API_BASE_URL` é pública e não é secret. Nenhuma chave privada no bundle.

## Portas sugeridas
- admin-web: 4200
- checkout-web: 4300
- api: 8080
- postgres: 5432
- redis opcional: 6379

## Configuração
Configuração sensível vem de secret manager do provedor de deploy. Configuração funcional do tenant fica em banco e passa por autorização/auditoria.
