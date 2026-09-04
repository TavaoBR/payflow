# 10 — Design System

## Direção
Visual financeiro SaaS claro, sóbrio e moderno. A referência é qualidade de produto, não “dashboard genérico de IA”. Deve existir um sistema coerente de tokens e componentes.

## Tipografia
Fonte principal: **Inter** (fallback `ui-sans-serif, system-ui`).
- Display/Page title: 28–32px, 650–700.
- Section title: 18–20px, 600–650.
- Card metric: 24–30px, 650–700.
- Body: 14–16px, 400–500.
- Label: 12–14px, 500–600.
- Caption: 12px, 400–500.
Line-height 1.3 títulos; 1.5 corpo.

## Cores via tokens CSS
```css
--pf-primary-600: #0B63F6;
--pf-primary-700: #0956D8;
--pf-navy-950: #062B63;
--pf-bg: #F7F9FC;
--pf-surface: #FFFFFF;
--pf-border: #E4EAF2;
--pf-text: #10213D;
--pf-muted: #6B7A90;
--pf-success: #12A66A;
--pf-warning: #E99A22;
--pf-danger: #E5484D;
--pf-info: #2563EB;
```
As cores podem ser refinadas durante implementação desde que contraste e direção sejam mantidos.

## Spacing
Escala base 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

## Radii
- inputs/buttons: 10–12px;
- cards: 14–16px;
- badges: 999px;
- modal: 16–20px.

## Shadows
Preferir borda + sombra mínima. Exemplo: `0 1px 2px rgba(16,33,61,.05), 0 8px 24px rgba(16,33,61,.04)` somente em superfícies elevadas.

## Buttons
Variantes: primary, secondary, ghost, danger, link. Altura 40/44px. Estado disabled reduz contraste mas mantém legibilidade. Loading preserva largura.

## Inputs/selects/textareas
Label externa, helper/error abaixo, altura 42–44px, border token. Focus ring 2px de primary com offset. Nunca depender de placeholder como label.

## Switch/checkbox/radio
Área de clique mínima 40px quando possível. Label clicável. Estado focus visível.

## Badges
Status financeiro com cor + texto/ícone. Ex.: Pago, Pendente, Recusado, Estornado. Não usar cor sozinha.

## Cards
Header opcional, body e footer. Padding 20–24px desktop, 16px mobile. KPI card não deve ter conteúdo excessivo.

## Tables
Header 12–13px semibold; row 48–56px; numeric alinhado à direita; hover sutil; seleção clara; ações em menu contextual. Em mobile, converter dados críticos para cards/lista, não criar scroll horizontal infinito para tudo.

## Dropdowns
Overlay alinhado ao trigger, keyboard nav, item destructive separado.

## Modals/Drawers
Ações destrutivas em modal; detalhes operacionais podem usar drawer. Focus trap, ESC, overlay e retorno de foco obrigatórios.

## Tooltips
Somente ajuda curta; não esconder informação essencial.

## Alerts/Toasts
Success, info, warning, error. Toast para feedback transitório; alert inline para bloqueios persistentes.

## Skeletons
Refletem forma da tela. Evitar skeleton por mais tempo que necessário.

## Empty states
Ícone simples, título, frase e CTA contextual. Não usar ilustração genérica em todas as telas.

## Loading states
- carregamento inicial: skeleton;
- botão: spinner inline;
- atualização silenciosa: indicador discreto;
- checkout: impedir dupla submissão e explicar estado.

## Breakpoints
- mobile: < 768px;
- tablet: 768–1199px;
- desktop: >= 1200px.
O comportamento é semântico, não apenas baseado em classes.
