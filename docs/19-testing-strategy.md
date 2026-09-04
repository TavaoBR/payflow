# 19 — Estratégia de testes

## Pirâmide pragmática
1. Domain/Application unit tests para regras financeiras e estados.
2. Integration tests para repositories, tenant isolation, auth e endpoints críticos.
3. Angular unit/component tests para facades, forms e componentes de decisão.
4. Playwright E2E para jornadas essenciais.

## Casos obrigatórios
- login válido/inválido/refresh;
- acesso cross-tenant negado;
- cálculo de pedido/desconto;
- idempotência de pagamento;
- link expirado;
- transição inválida de payment status;
- refund acima do disponível;
- webhook signature e retry;
- checkout PIX success flow;
- checkout card declined flow;
- permissões de UI não substituem 403 do backend.

## E2E smoke
Login → produto → link → checkout → PIX mock → confirmar sandbox → dashboard/transação.

## Dados
Factories/builders. Nunca depender de dados manuais persistentes.

## CI
PR bloqueia merge se build/test/lint críticos falharem.
