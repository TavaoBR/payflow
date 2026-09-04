# 12 — Estrutura de telas

## Convenção por tela
Cada tela abaixo define objetivo, rota, acesso, dados, ações, endpoints, estados e comportamento responsivo.

### Login
- Rota: `/auth/login`
- Acesso: público.
- Componentes: brand panel opcional, form, password visibility, forgot link futuro.
- Endpoints: `POST /api/v1/auth/login`.
- Estados: idle, submitting, invalid credentials, rate limited.
- Mobile: card ocupa largura útil; sem ilustração pesada.

### Dashboard
- Rota: `/dashboard`
- Permissão: `dashboard.read`.
- Dados: KPIs, série temporal, distribuição por método, transações recentes.
- Endpoint: `GET /api/v1/dashboard/summary?from&to`.
- Estados: skeleton, partial chart error possível, empty de período.
- Desktop: 4 KPIs + 2 painéis + tabela. Mobile: empilhado.

### Transações
- Rota: `/transactions`
- Permissão: `transactions.read`.
- Componentes: filtros, KPI opcional, tabela, drawer de detalhe.
- Endpoints: `GET /transactions`, `GET /transactions/{id}`, `POST /transactions/{id}/refund`.
- Estados: loading, empty, filtered-empty, error.
- Mobile: lista/cards; detalhe full-screen.

### Pedidos
- Rota: `/orders`, `/orders/:id`
- Permissões: `orders.read`, `orders.write`.
- Dados: código, cliente, itens, totals, status, pagamentos relacionados.
- Ações: criar pedido, cancelar quando permitido, abrir checkout/link.

### Produtos
- Rota: `/products`, `/products/new`, `/products/:id/edit`
- Permissões: read/write.
- Dados: tipo, preço, status, disponibilidade.
- Endpoints: CRUD `/products`.
- Form: sections básicos, preço, disponibilidade, mídia.

### Clientes
- Rota: `/customers`, `/customers/:id`
- Permissões: read/write.
- Dados: identificação mínima, métricas, pedidos recentes.
- Ações: cadastrar, editar, desativar.

### Links de pagamento
- Rota: `/payment-links`
- Permissões: read/write.
- Componentes: create form, preview, list.
- Endpoints: CRUD/activate/pause `/payment-links`.
- Estados: preview local + validação do backend.

### Configurações do checkout
- Rota: `/settings/checkout`
- Permissão: `checkout_settings.write`.
- Tabs: Personalização, Checkout, Pagamentos, Notificações/Integrações, Avançado.
- Endpoint: `GET/PUT /checkout-settings`.
- Preview: render com os mesmos tokens/componentes do checkout quando possível.

### Usuários e permissões
- Rota: `/settings/users`
- Permissão: `users.manage`.
- Ações: criar, editar role, desativar, reset de sessão futuro.

### Webhooks
- Rota: `/settings/webhooks`
- Permissão: `webhooks.manage`.
- Dados: endpoint, eventos, status, últimas entregas.
- Ações: criar, rotacionar secret, testar, desativar.

### Auditoria
- Rota: `/settings/audit`
- Permissão: `audit.read`.
- Filtros por ator, ação, entidade e data.

### Checkout público — identificação/método
- Rota: `/c/:token`
- Público.
- Endpoints: `GET /public/checkouts/{token}`, `POST /public/checkouts/{token}/session`, `POST /public/checkout-sessions/{id}/payment`.
- Dados: branding sanitizado, pedido/link, methods, expiration.
- Estados: available, expired, unavailable, submitting.
- Mobile: resumo colapsável mas sempre acessível.

### PIX pendente
- Rota: `/c/:token/payment/:transactionId` ou estado interno.
- Dados: QR/payload mock, expiração, status.
- Endpoint: `GET /public/payment-transactions/{publicToken}/status`.
- Ações: copiar código, voltar se permitido.

### Cartão mock
- Coleta somente dados fictícios; banner claro de sandbox.
- Tokenização simulada no client/provider mock; API recebe token de método, não PAN/CVV persistível.
- Cenários de teste documentados (ex.: token `tok_success`, `tok_declined`).

### Boleto pendente
- Linha digitável fictícia, vencimento, copiar código, status.

### Sucesso
- Rota/estado final.
- Dados: código público, método, total, timestamp, próximos passos.
- Ações: baixar comprovante mock/PDF futuro, voltar para URL do merchant.

### Falha/recusado
- Explicar falha sem expor internals; permitir tentar outro método quando sessão ainda válida.
