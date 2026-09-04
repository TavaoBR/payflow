# 06 — Arquitetura frontend Angular

## Estrutura sugerida

```text
src/app/
├── core/
│   ├── auth/
│   ├── http/
│   ├── guards/
│   ├── permissions/
│   ├── error-handling/
│   └── config/
├── layout/
│   ├── admin-shell/
│   └── public-shell/
├── shared/
│   ├── ui/
│   ├── pipes/
│   ├── directives/
│   └── utils/
├── features/
│   ├── dashboard/
│   ├── transactions/
│   ├── orders/
│   ├── products/
│   ├── customers/
│   ├── payment-links/
│   ├── checkout-settings/
│   └── users/
└── app.routes.ts
```

Checkout público pode viver em app Angular separado (`checkout-web`) para bundle, layout e políticas de segurança independentes, reutilizando somente tokens/types realmente compartilháveis.

## Pages/Containers
Conhecem rota, facade/store e composição da tela. Não fazem `http.get` diretamente e não contêm lógica de formatação repetível.

## Components
Componentes visuais recebem inputs e emitem outputs. Devem ser pequenos, previsíveis e acessíveis.

## State/Facade
Cada feature complexa possui facade/store expondo signals de `data`, `loading`, `error`, filtros e ações. Evitar store global para estado que pertence apenas a uma página.

## API Services
Um serviço por contexto/feature. URLs centralizadas. Retorno tipado. Interceptors tratam auth, correlation id quando necessário e normalização de erros.

## Signals e RxJS
- Signals: estado de UI e derivados.
- RxJS: HTTP, debounce, cancelamento e streams.
- `toSignal`/`toObservable` somente quando a fronteira fizer sentido.

## Forms
Reactive Forms tipados. Validators compartilhados. Mensagens de erro derivadas de códigos conhecidos do backend, sem duplicar regra crítica.

## Auth e permissions
Guard protege navegação, mas a autorização real é backend. Uma `PermissionService`/directive (`hasPermission`) evita checks repetidos.

## Loading e erro
Toda page deve modelar: initial loading, refreshing, success, empty e error. Skeleton para carregamento estrutural; spinner apenas para ações localizadas.

## Estilos
Tokens CSS centralizados. Tailwind para composição. Não usar valores hex/radius arbitrários repetidos em templates.

## Acessibilidade
Foco visível, labels, aria quando necessário, modal com focus trap, navegação por teclado e `prefers-reduced-motion`.

## Performance
Lazy routes, defer de blocos pesados, imagens otimizadas, trackBy/track quando aplicável, sem subscriptions não descartadas e sem re-renderizações causadas por estado global desnecessário.
