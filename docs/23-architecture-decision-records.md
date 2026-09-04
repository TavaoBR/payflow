# 23 — Architecture Decision Records (ADR)

Crie `docs/adr/ADR-XXXX-title.md` quando uma decisão alterar arquitetura, dependência relevante, contrato ou regra de domínio.

Template:
```md
# ADR-XXXX — Título
Status: Proposed | Accepted | Superseded
Date: YYYY-MM-DD

## Contexto
## Opções consideradas
## Decisão
## Consequências positivas
## Consequências negativas
## Plano de migração/reversão
```

ADRs iniciais implícitos:
- monólito modular;
- Angular 22 + Tailwind;
- .NET 10 LTS;
- PostgreSQL;
- gateway mock primeiro;
- banco compartilhado com tenant_id;
- money como decimal/string no contrato.
