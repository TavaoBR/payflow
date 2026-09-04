# 16 — Git workflow

## Branches
- `main`: sempre demonstrável.
- feature branches curtas: `feat/task-023-payment-links-list`.
- fixes: `fix/task-XXX-...`.

## Pull Request
Cada PR deve referenciar uma TASK, explicar alteração, riscos, screenshots para UI, testes executados e migrations quando houver.

## Regra de escopo
Uma TASK por PR quando razoável. Não misturar refactor grande com feature sem necessidade.

## Migrations
Nunca editar migration já aplicada em ambiente compartilhado; criar nova migration corretiva.

## Review checklist
Arquitetura, segurança, tenant isolation, autorização, UX, testes, lint/build, secrets, breaking changes e docs.
