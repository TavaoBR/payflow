# 20 — Observabilidade e auditoria

## Logs
Estruturados com `timestamp, level, traceId, tenantId, userId?, route, eventName`. PII sanitizada.

## Métricas
- request duration/error rate;
- payment attempts por status/method;
- webhook deliveries/retries;
- database latency;
- queue/backlog se houver.

## Tracing
Correlation ID em cada request; OpenTelemetry pode ser ativado na fase 09.

## Health
`/health/live` não depende do DB; `/health/ready` valida dependências críticas.

## Auditoria
Diferente de log: registro de negócio imutável para alterações sensíveis. Ex.: user.role_changed, checkout.settings_updated, transaction.refund_requested, webhook.secret_rotated.

## Retenção
Definir política por ambiente. Demo pode limpar logs e dados de sandbox periodicamente.
