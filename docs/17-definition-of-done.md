# 17 — Definition of Done

Uma TASK só está concluída quando todos os itens aplicáveis estão atendidos:

- escopo funcional completo;
- dependências satisfeitas;
- arquitetura Controller → Use Case/Service → Repository respeitada;
- entidades não vazam como contratos HTTP;
- validações de input e negócio implementadas;
- autorização e tenant isolation no backend;
- erros tratados e mensagem segura;
- loading/success/empty/error implementados na UI quando aplicável;
- responsividade mobile/tablet/desktop validada;
- UI coerente com design system e referências;
- acessibilidade básica validada por teclado/foco/labels;
- nenhum secret ou dado sensível exposto;
- migrations criadas e testadas quando necessário;
- unit/integration/component/E2E relevantes passam;
- lint passa;
- build backend e frontend passa;
- OpenAPI/contratos atualizados quando endpoint mudou;
- documentação afetada atualizada;
- logs/auditoria adicionados para ação sensível;
- sem TODO crítico escondido;
- PR/commit ligado à TASK.

Se algum item não se aplica, a TASK pode declarar explicitamente `N/A` com justificativa.
