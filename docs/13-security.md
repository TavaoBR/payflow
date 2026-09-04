# 13 — Segurança

## Secrets
Nunca versionar `.env`, secrets, tokens, senhas, API keys, private keys ou connection strings. Versionar somente `.env.example` com placeholders.

## Dados de cartão
O MVP não processa cartão real. **Nunca armazenar CVV. Nunca logar PAN.** Preferir tokens mock. Qualquer evolução para provider real deve usar hosted fields/tokenization do provedor e revisão específica de PCI scope.

## Autenticação
Access token curto, refresh rotacionável, revogação, rate limit de login, hashing forte e cookies HttpOnly/SameSite se refresh for transportado por cookie.

## Autorização
Permission + tenant no backend. Evitar IDOR: todo recurso privado é carregado já com escopo de tenant.

## CORS
Allowlist explícita por ambiente. Nunca `*` com credenciais.

## CSRF
Se autenticação mutável usar cookie, implementar antiforgery/CSRF token. Bearer token em Authorization reduz esse vetor, mas endpoints com cookie precisam proteção.

## XSS
Angular escaping padrão; evitar `innerHTML`. Conteúdo rich text sanitizado. CSP em produção.

## SQL Injection
EF Core parametrizado; SQL raw apenas com parâmetros e revisão.

## Rate limiting
Login, checkout public resolution, create payment, status polling e webhook test possuem limites diferentes.

## Validation
Limites de tamanho, whitelist de enums, normalização de e-mail, money e URLs. Nunca confiar em preço/total vindo do frontend.

## Webhooks
HTTPS em produção, bloquear localhost/private network para evitar SSRF quando aplicável, assinatura HMAC, timeout curto, retry e payload sem secrets.

## Upload
Logo/imagem: mime real, tamanho, dimensões, nome gerado, storage fora do webroot quando aplicável.

## Logs
Sem password, token, Authorization header, PAN/CVV, webhook secret ou PII desnecessária. IDs e last4 podem ser suficientes.

## Headers
HSTS, CSP, X-Content-Type-Options, Referrer-Policy e frame policy adequada, principalmente checkout.

## Dependency security
Dependabot/Renovate opcional, `dotnet list package --vulnerable`, npm audit/OSV conforme pipeline, sem bloquear por ruído irrelevante mas bloqueando high/critical confirmado.
