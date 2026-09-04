# 02 — Requisitos funcionais

## FR-001 Autenticação
Usuários internos podem entrar, renovar sessão e sair. Contas inativas ou sem permissão não acessam recursos protegidos.

## FR-002 Gestão de usuários
Owner/Admin cadastra, edita, desativa usuários e atribui roles permitidas ao tenant.

## FR-003 Dashboard
Exibe receita simulada, quantidade de vendas, ticket médio, conversão, distribuição por método e transações recentes, respeitando período e tenant.

## FR-004 Produtos
Cadastrar produto físico, digital, serviço ou assinatura simulada. Campos: nome, descrição, SKU opcional, tipo, preço, moeda, status, disponibilidade e imagem opcional.

## FR-005 Clientes
Cadastrar e consultar cliente com nome, e-mail, telefone e documento opcional. Exibir histórico de pedidos e métricas agregadas.

## FR-006 Pedidos
Criar pedido a partir de itens, cliente e regras de preço. Pedido calcula subtotal, desconto e total no backend e possui estado próprio.

## FR-007 Transações
Registrar tentativas de pagamento vinculadas a pedido/checkout. Status: pending, processing, paid, failed, cancelled, expired, refunded, partially_refunded quando aplicável.

## FR-008 Links de pagamento
Criar link com título, valor ou produto, expiração, métodos aceitos, desconto PIX, parcelamento e status. Link público deve usar token/slug não previsível.

## FR-009 Checkout white-label
Configurar logo, nome de exibição, cores, tipografia aprovada, radius, texto de CTA, mensagem pós-pagamento e redirecionamento.

## FR-010 Checkout público
Resolver token, validar disponibilidade/expiração, coletar dados mínimos do cliente, aplicar cupom quando suportado, selecionar método e iniciar pagamento.

## FR-011 PIX mock
Gerar payload e QR Code fake, expiração, estado pendente e simulação segura de confirmação por endpoint administrativo de sandbox ou job.

## FR-012 Cartão mock
Coletar dados fictícios somente na sessão da UI e enviar um `paymentMethodToken` de sandbox. Não persistir PAN/CVV. O mock retorna cenários determinísticos de sucesso/falha.

## FR-013 Boleto mock
Gerar linha digitável fictícia, vencimento e estado pendente. Permitir simular pagamento no sandbox.

## FR-014 Webhooks
Merchant configura URL e secret. Eventos de pagamento são enviados com assinatura HMAC, idempotency/event id, histórico de tentativas e retry.

## FR-015 Auditoria
Ações sensíveis registram ator, tenant, ação, entidade, entityId, timestamp, correlationId e metadata sanitizada.

## FR-016 Reembolso mock
Usuário autorizado solicita reembolso total ou parcial em transação paga, respeitando limite do valor líquido elegível.

## FR-017 Busca e paginação
Listagens operacionais suportam paginação server-side, filtros, ordenação e busca textual controlada.

## FR-018 Responsividade e acessibilidade
Todos os fluxos essenciais devem operar em desktop, tablet e mobile; teclado, foco, labels e contrastes devem ser considerados desde o início.
