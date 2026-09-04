# 22 — Requisitos não funcionais

## Performance
- p95 API de leitura comum < 400ms em ambiente demo saudável;
- first usable admin page sem assets desnecessários;
- lazy loading por feature;
- paginação server-side acima de 100 itens.

## Segurança
OWASP ASVS-inspired baseline proporcional ao projeto; secrets e cartão real proibidos.

## Disponibilidade
Demo não exige SLA, mas health checks e graceful errors são obrigatórios.

## Escalabilidade
Monólito modular horizontalmente escalável; estado de sessão não depende de memória local quando produção exigir múltiplas instâncias.

## Manutenibilidade
Cobertura focada em regras críticas, modules claros, ADRs e documentação atualizada.

## Acessibilidade
WCAG 2.2 AA como meta para fluxos principais.

## Compatibilidade
Últimas versões estáveis de Chrome, Edge, Firefox e Safari; mobile browsers modernos.
