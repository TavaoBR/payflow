# 01 — Visão geral do projeto

## Problema
Pequenos negócios e produtos digitais frequentemente precisam cobrar clientes por links ou checkout próprio, mas soluções reais de pagamentos são complexas e exigem integração, segurança e regras regulatórias. O PayFlow modela essa experiência em ambiente de portfólio, com gateway mock/sandbox e arquitetura pronta para substituir o provider no futuro.

## Proposta
Uma plataforma SaaS que centraliza:
- catálogo de produtos;
- clientes;
- pedidos;
- transações;
- links de pagamento;
- checkout white-label;
- configuração de métodos e regras comerciais;
- webhooks de eventos;
- auditoria e observabilidade.

## Personas
1. **Owner/Admin do merchant**: configura marca, usuários, produtos, regras de checkout e acompanha resultados.
2. **Operador/Analista**: consulta pedidos, clientes e transações, sem permissões administrativas críticas.
3. **Cliente final**: acessa um checkout público e conclui um pagamento simulado.
4. **Desenvolvedor integrador**: configura webhook e acompanha eventos técnicos.

## Escopo MVP
- autenticação e RBAC;
- dashboard;
- CRUD de produtos e clientes;
- pedidos;
- transações somente leitura operacional + ações controladas de reembolso mock;
- links de pagamento;
- configurações visuais do checkout;
- PIX/cartão/boleto mock;
- checkout público;
- webhooks com retry;
- auditoria;
- documentação OpenAPI;
- testes críticos e CI.

## Fora do escopo inicial
- custódia de dinheiro;
- adquirência real;
- PAN/CVV reais;
- KYC/KYB;
- antifraude real;
- chargeback real;
- split/marketplace real;
- emissão fiscal;
- contabilidade.

## Critérios de sucesso de portfólio
- arquitetura coerente e fácil de explicar em entrevista;
- Angular usado de forma moderna e idiomática;
- domínio financeiro sem erros básicos de precisão/idempotência;
- UI com padrão consistente e responsivo;
- fluxo completo demonstrável em poucos minutos;
- README e documentação suficientes para execução independente.
