# 05 — Arquitetura backend

## Estrutura sugerida

```text
src/
├── PayFlow.Api/
│   ├── Controllers/
│   ├── Filters/
│   ├── Middleware/
│   └── Program.cs
├── PayFlow.Application/
│   ├── Abstractions/
│   ├── Features/
│   │   ├── Products/
│   │   ├── Customers/
│   │   ├── Orders/
│   │   └── Payments/
│   ├── DTOs/
│   ├── Validators/
│   └── Exceptions/
├── PayFlow.Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Enums/
│   ├── Events/
│   └── Rules/
├── PayFlow.Infrastructure/
│   ├── Persistence/
│   ├── Repositories/
│   ├── Payments/
│   ├── Webhooks/
│   ├── Security/
│   └── Observability/
└── PayFlow.Contracts/
    ├── Requests/
    └── Responses/
```

## Controllers
Responsáveis apenas por HTTP: binding, chamada do use case/service, resposta/status code. Proibido: SQL/EF queries, cálculo financeiro, autorização ad hoc, manipulação direta de DbContext.

## Application Services / Use Cases
Orquestram caso de uso, validação contextual, autorização de domínio, transação, repositories e eventos. Devem ser testáveis sem servidor HTTP.

## Domain
Entidades e value objects protegem invariantes. Exemplos: `Money`, `Order`, `PaymentTransaction`, `Refund`. Domínio não referencia ASP.NET Core nem EF Core diretamente.

## Repositories
Interfaces na Application/Domain conforme necessidade; implementação em Infrastructure. Métodos devem expressar intenção, por exemplo `GetActivePaymentLinkAsync(tenantId, token)` em vez de expor `IQueryable` para qualquer camada.

## DTOs e Contracts
- Request/Response não são Entity.
- Mapear explicitamente.
- Não retornar campos internos, hashes, secrets ou metadata sensível.

## Validators
FluentValidation para formato e regras de entrada. Regras de negócio dependentes de estado permanecem no use case/domínio.

## Exceptions
Tipos conhecidos: Validation, NotFound, Conflict, BusinessRule, Unauthorized, Forbidden, RateLimit. Middleware global converte em Problem Details/padrão de erro definido em `08-api-contracts.md`.

## Middleware
CorrelationId, exception handling, request logging sanitizado, tenant resolution, rate limiting e security headers quando aplicável.

## Persistência
DbContext por request. Migrations em projeto/namespace de Infrastructure. Configurações de EntityType separadas. Índices e constraints explícitos.

## Auditoria
Use case sensível persiste audit entry via serviço dedicado. Nunca registrar senha, token, CVV, PAN ou payload completo de cartão.

## Pagamentos
`IPaymentGateway` define operações do provider. `MockPaymentGateway` implementa cenários determinísticos. O domínio não conhece nomes de provedores.

## Testes
- Domain: invariantes e cálculos.
- Application: use cases com fakes/mocks de repositories.
- Infrastructure: integração com PostgreSQL real/testcontainer quando viável.
- API: endpoints críticos, auth e contrato.
