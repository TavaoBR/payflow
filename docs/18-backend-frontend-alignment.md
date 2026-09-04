# 18 — Alinhamento Backend x Frontend

## Fonte de verdade
O contrato OpenAPI e os arquivos de contrato documentados são a fonte de verdade entre apps. O frontend não adivinha nomes, enums ou formatos.

## Request/Response
Requests contêm apenas dados que o cliente pode fornecer. Totals, tenantId, userId e status sensíveis são derivados no backend.

## Validation errors
Código estável + field opcional + message amigável. Frontend mapeia field errors ao form e erros gerais a alert/toast.

## Business errors
Códigos estáveis, ex.: `payment_link.expired`, `order.not_payable`, `refund.exceeds_available_amount`.

## Auth errors
401: sessão ausente/expirada; frontend tenta refresh uma única vez quando elegível. 403: manter sessão e mostrar acesso negado.

## Dates/timezones
API UTC. UI usa locale `pt-BR` e timezone configurável; demo padrão pode exibir `America/Sao_Paulo`, sem alterar o instante persistido.

## Enums
Strings snake_case ou lowercase estáveis. Frontend possui mapa de label separado do valor da API.

## Money
API string decimal + currency. Frontend formata por `Intl.NumberFormat`, nunca usa valor formatado como payload.

## IDs
UUID privado e public tokens opacos. Frontend não constrói semântica a partir de IDs.

## Uploads
Frontend valida UX; backend valida segurança novamente.

## Compatibilidade
Mudança de contrato deve atualizar OpenAPI, types do frontend, testes de contrato e docs na mesma TASK/PR.
