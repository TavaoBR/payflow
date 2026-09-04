# 21 — Regras do domínio de pagamentos

## Princípios
Backend é fonte de verdade para preço, desconto, status e elegibilidade. Toda operação financeira crítica é idempotente.

## Estados de pedido
`draft → pending_payment → paid | cancelled | expired`.
Transições adicionais exigem ADR.

## Estados de transação
`pending → processing → paid`
`pending|processing → failed|cancelled|expired`
`paid → partially_refunded|refunded`
Não permitir retorno arbitrário de `paid` para `pending`.

## PIX mock
- validade definida no backend;
- QR/payload são fictícios e marcados como sandbox;
- confirmação muda transação uma única vez;
- polling não altera status, apenas lê.

## Cartão mock
- UI nunca envia/armazenará cartão real no MVP;
- usar tokens/cenários fictícios;
- `tok_success` → paid; `tok_declined` → failed; `tok_processing` → processing, por exemplo;
- qualquer número digitado é apenas UX demo e descartado antes de persistência.

## Boleto mock
- linha digitável fictícia;
- vencimento real de sandbox;
- confirmação simulada idempotente.

## Desconto PIX
Aplicado no backend sobre subtotal elegível. Arredondamento monetário explícito para 2 casas em BRL, `MidpointRounding` documentado.

## Parcelamento
No MVP, pode simular juros simples por regra configurada. O backend retorna tabela de parcelas; frontend não recalcula regra crítica.

## Refund
Valor acumulado não supera o pago. Refund usa idempotency key. Status final deriva do acumulado.

## Webhooks
Eventos são fatos pós-commit. Delivery pode repetir; consumidor deve usar event id para idempotência.
