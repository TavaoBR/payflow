# 08 — Contratos da API

## Base
`/api/v1`

## Envelope de sucesso

```json
{
  "success": true,
  "data": {},
  "message": null,
  "errors": []
}
```

## Listas paginadas

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "lastPage": 8
  },
  "message": null,
  "errors": []
}
```

## Erro

```json
{
  "success": false,
  "data": null,
  "message": "Não foi possível processar a solicitação.",
  "errors": [
    { "code": "validation.email.invalid", "field": "email", "message": "E-mail inválido." }
  ],
  "traceId": "..."
}
```

## Status HTTP
- 200 leitura/ação concluída;
- 201 criação;
- 204 exclusão sem body;
- 400 payload inválido;
- 401 não autenticado;
- 403 sem permissão;
- 404 inexistente ou não visível ao tenant;
- 409 conflito/idempotência/estado;
- 422 regra de negócio quando semanticamente útil;
- 429 rate limit;
- 500 erro inesperado sem detalhes internos.

## Datas
ISO-8601 UTC: `2026-09-03T21:30:00Z`. UI converte para locale/timezone configurado.

## Dinheiro
Preferência de contrato:
```json
{ "amount": "284.91", "currency": "BRL" }
```
String decimal evita ambiguidade de float em clientes. Frontend usa helper Money.

## Enums
Enviar strings estáveis (`paid`, `pending`) e nunca ordinal numérico.

## IDs
UUID canônico em rotas privadas. Recursos públicos usam token opaco aleatório; não expor sequência incremental.

## Paginação/filtro/sort
`?page=1&perPage=20&status=paid&method=pix&sort=-createdAt&search=...`
Whitelist de campos ordenáveis; `perPage` máximo definido por endpoint.

## Uploads
Multipart apenas em endpoint específico. Validar mime real, tamanho e extensão; gerar nome interno; não confiar no nome original.

## Headers
- `Authorization: Bearer <token>`
- `Idempotency-Key` em operações financeiras mutáveis críticas.
- `X-Correlation-ID` opcional do cliente; servidor sempre gera/normaliza.

## Versionamento
Breaking changes exigem `/v2` ou estratégia formal. Não quebrar consumidores dentro de `/v1`.
