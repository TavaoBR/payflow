# 11 — Diretrizes UI/UX

## Hierarquia
Toda tela deve responder: onde estou, o que posso fazer, qual informação é mais importante e qual o próximo passo. Título + descrição curta + ação principal no topo.

## Densidade
Painel administrativo pode ser denso; checkout público deve ser simples e focado. Não preencher espaço com cards sem função.

## Navegação
Sidebar persistente desktop; drawer no mobile. Item ativo claro. Submenus apenas se necessários. Checkout público não herda navegação administrativa.

## Feedback
Toda ação mutável deve produzir: loading, success ou erro acionável. Não exibir stack trace. Mensagens devem orientar correção.

## Formulários
Agrupar campos por contexto. Validar no blur/submit sem punir digitação. Manter valores após erro do servidor. Campos financeiros usam máscara visual e valor normalizado.

## Checkout
- resumo do pedido sempre acessível;
- CTA inequívoco;
- método selecionado evidente;
- não criar urgência falsa;
- informar expiração real do PIX/link;
- prevenção contra duplo clique/dupla cobrança;
- status pode ser atualizado por polling com backoff ou evento, mas backend é fonte de verdade.

## Tabelas
Filtros server-side, estado dos filtros refletido na URL quando útil. Paginação previsível. Empty state diferente de “sem resultados para filtro”.

## Responsividade
Desktop: layout amplo com painéis laterais. Tablet: grids 2→1 quando necessário. Mobile: sidebar vira drawer, painéis laterais viram seções ou bottom sheet, tabelas viram cards para ações críticas.

## Acessibilidade
WCAG AA como meta: contraste, foco, labels, erros associados, semântica, `aria-live` para feedback de pagamento, suporte a teclado e reduced motion.

## Microinterações
150–220ms; easing discreto. Sem animações decorativas excessivas. Em sucesso, uma animação breve é aceitável se respeitar reduced motion.

## Anti-padrões visuais
- gradientes aleatórios e glow excessivo;
- glassmorphism em toda superfície;
- cards para cada linha de texto;
- ícones sem significado;
- cores diferentes a cada módulo;
- títulos gigantes;
- sombras pesadas;
- placeholder como label;
- “AI-looking” copy ou métricas inventadas.
