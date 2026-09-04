# 07 — Design de banco de dados

## Convenções
- PostgreSQL.
- PK interna: UUID.
- `tenant_id` obrigatório em dados privados.
- `created_at`, `updated_at` UTC.
- soft delete apenas onde houver requisito; preferir status explícito.
- `numeric(19,4)` ou precisão adequada para valores monetários; currency ISO-4217.
- índices compostos iniciam por `tenant_id` quando filtragem tenant é predominante.

## Entidades principais

### tenants
`id, name, slug, status, created_at, updated_at`

### users
`id, tenant_id, name, email_normalized, password_hash, status, created_at, updated_at`
Unique: `(tenant_id, email_normalized)`.

### roles / permissions / user_roles / role_permissions
RBAC normalizado. Roles seedadas: Owner, Admin, Analyst, SupportReadOnly.

### refresh_tokens
`id, user_id, token_hash, expires_at, revoked_at, replaced_by_id, created_at, ip_hash?`
Nunca armazenar token puro.

### products
`id, tenant_id, name, slug, sku, type, description, price_amount, currency, status, stock_mode, stock_quantity, image_url, created_at, updated_at`

### customers
`id, tenant_id, name, email, phone, document_hash?, document_last4?, status, created_at, updated_at`
No MVP, documento completo só se realmente necessário; preferir minimizar dados.

### orders
`id, tenant_id, customer_id?, public_code, status, currency, subtotal_amount, discount_amount, total_amount, created_at, updated_at`

### order_items
`id, order_id, product_id?, description_snapshot, quantity, unit_amount, total_amount`
Snapshot protege histórico mesmo se produto mudar.

### payment_links
`id, tenant_id, token_hash/public_token, title, description, product_id?, fixed_amount?, currency, allowed_methods, pix_discount_pct, max_installments, expires_at, status, created_at, updated_at`

### checkout_sessions
`id, tenant_id, payment_link_id?, order_id?, public_token, status, expires_at, customer_snapshot_json?, created_at, updated_at`

### payment_transactions
`id, tenant_id, order_id, checkout_session_id?, provider, provider_reference, method, status, amount, fee_amount, net_amount, currency, idempotency_key, failure_code?, created_at, updated_at, paid_at?`

### payment_method_metadata
Somente dados não sensíveis: `brand`, `last4`, `installments`, `pix_expiration`, `boleto_due_date`. Nunca CVV/PAN.

### refunds
`id, tenant_id, payment_transaction_id, amount, status, reason, idempotency_key, created_at, processed_at?`

### checkout_branding
`tenant_id, logo_url, primary_color, secondary_color, font_family, radius_preset, cta_text, success_title, success_message, redirect_url, redirect_delay_seconds`

### webhook_endpoints
`id, tenant_id, url, secret_encrypted, status, subscribed_events, created_at, updated_at`

### webhook_events
`id, tenant_id, event_type, aggregate_type, aggregate_id, payload_json, created_at`

### webhook_deliveries
`id, event_id, endpoint_id, attempt, status, response_code, next_retry_at, delivered_at, last_error_sanitized`

### audit_entries
`id, tenant_id, actor_user_id?, action, entity_type, entity_id?, correlation_id, metadata_json, created_at`

### idempotency_records
`id, tenant_id, key, route_scope, request_hash, response_status, response_body_json, expires_at, created_at`

## Integridade
- total do pedido >= 0;
- refund total acumulado <= payment paid amount;
- link expirado não cria nova sessão;
- transaction idempotency unique por tenant/scope;
- tenant foreign keys consistentes.
