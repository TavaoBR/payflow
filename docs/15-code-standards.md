# 15 — Padrões de código

## Gerais
- nomes em inglês no código; UI e docs de produto em pt-BR quando aplicável;
- funções pequenas e orientadas a intenção;
- sem comentários explicando código óbvio;
- comentários justificam decisão, risco ou workaround;
- sem dead code ou TODO sem ticket.

## Backend
- nullable habilitado;
- async end-to-end para I/O;
- `CancellationToken` em operações assíncronas HTTP/DB;
- controllers finos;
- repositories sem retornar `IQueryable` para controller;
- `decimal` para dinheiro;
- enums como tipos internos e strings nos contratos;
- Result pattern opcional, mas consistente;
- guard clauses e exceptions de domínio controladas.

## Angular
- Standalone Components;
- change detection e signals idiomáticos;
- templates sem lógica complexa;
- strict templates;
- sem `any` sem justificativa;
- evitar subscription manual quando async pipe/signal resolve;
- forms tipados;
- feature routes lazy;
- selectors/test ids estáveis somente quando necessários.

## CSS
Tokens antes de valores arbitrários. Componentes compartilhados possuem API visual consistente.

## Commits
Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
