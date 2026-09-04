# 04 — Arquitetura do sistema

## Estilo
Monólito modular no backend + duas aplicações Angular no mesmo workspace ou monorepo lógico:

```text
payflow/
├── apps/
│   ├── admin-web/
│   ├── checkout-web/
│   └── api/
├── libs/                 # somente se o workspace Angular realmente usar libs
├── docs/
└── infra/
```

O monólito modular reduz complexidade operacional sem sacrificar fronteiras de domínio. Módulos iniciais: Identity, Merchants, Catalog, Customers, Orders, Payments, PaymentLinks, CheckoutConfiguration, Webhooks, Audit.

## Fluxo backend

```text
HTTP Request
  → Controller
  → Application Service / Use Case
  → Domain rules
  → Repository interface
  → Infrastructure repository / EF Core
  → PostgreSQL
```

Cross-cutting: validation, authorization, idempotency, transaction boundary, logging, correlation id e exception mapping.

## Fluxo frontend

```text
Route
  → Page/Container
  → Feature Facade/Store
  → API Service
  → HttpClient + Interceptors
  → Backend

Page
  → Presentational Components
  → Design System primitives
```

## Bounded contexts pragmáticos

### Identity
Usuários, roles, permissions, sessões/refresh tokens.

### Merchant
Tenant, configurações gerais e isolamento.

### Catalog
Produtos e preços.

### Customers
Clientes do merchant.

### Orders
Pedido, itens, totals e lifecycle.

### Payments
PaymentAttempt/Transaction, provider abstraction, refunds e status.

### Payment Links
Links públicos, expiração, regras e métricas de acesso/conversão.

### Checkout
Branding/configuração, sessão pública e composição da experiência.

### Webhooks
Subscriptions/endpoints, events, deliveries e retry.

### Audit
Trilha imutável de ações sensíveis.

## Multi-tenancy
MVP usa banco compartilhado e `TenantId` obrigatório em todas as entidades de negócio privadas. Todo repository privado recebe tenant context implicitamente ou explicitamente. Nenhuma query deve depender apenas de filtro no frontend.

## Eventos internos
Eventos de domínio/application podem ser usados para desacoplar ações como `PaymentPaid → OrderPaid + WebhookQueued + AuditEntry`. Evitar event bus distribuído no MVP.

## Transações
Operações que alteram pedido + pagamento + ledger simplificado relacionado devem usar transação de banco quando exigirem atomicidade. Webhook externo nunca fica dentro da transação do banco: persistir evento e despachar depois.

## Idempotência
Endpoints de criação de pagamento e processamento de callbacks/simulações devem aceitar/gerar chaves idempotentes. Repetir a mesma chave com o mesmo payload retorna o resultado original; payload diferente com mesma chave retorna conflito.
