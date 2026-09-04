# 03 — Stack técnica

> Baseline de setembro de 2026. Atualizações de patch são permitidas; mudanças de major exigem registro de decisão.

## Frontend

### Angular 22
Escolhido por ser o foco do portfólio e por oferecer Standalone Components, Signals, lazy loading e ecossistema corporativo. Utilizar a major 22.x suportada no momento do bootstrap.

### TypeScript strict
`strict: true`, sem `any` não justificado. Contratos de API tipados e discriminated unions para estados relevantes.

### Angular Signals + RxJS
Signals para estado local/derivado e integração reativa de UI; RxJS para fluxos assíncronos, HTTP e composição temporal. Evitar Subject global sem necessidade.

### Reactive Forms tipados
Formulários de autenticação, produto, cliente, link e checkout devem usar Reactive Forms e validadores reutilizáveis.

### Tailwind CSS 4.x
Base utilitária para composição visual sem herdar aparência pronta de um kit genérico. Tokens do design system ficam centralizados em CSS variables/theme.

### Angular CDK
Overlay, dialog, focus management, a11y e primitives quando úteis. Evitar depender de Material visualmente se ele conflitar com as referências.

### Lucide Icons
Conjunto consistente de ícones lineares.

### Gráficos
Chart.js ou ECharts via adapter próprio. Não deixar a biblioteca vazar para pages; encapsular gráficos em componentes.

### Testes
- unit/component: ferramenta padrão do workspace Angular ou Vitest quando oficialmente suportado e configurado no bootstrap;
- E2E: Playwright;
- lint/format: ESLint + Prettier.

## Backend

### .NET 10 LTS / ASP.NET Core
Versão LTS ativa, adequada a APIs corporativas, boa integração com OpenAPI, DI, observabilidade e performance.

### C# 14
Nullable reference types habilitados; records para contratos imutáveis quando adequado.

### Entity Framework Core 10
ORM para PostgreSQL. Migrations versionadas; consultas complexas encapsuladas em repositories/query services.

### PostgreSQL
Banco relacional robusto, bom suporte a índices, constraints, JSONB pontual e transações.

### FluentValidation
Validação de requests/application commands fora de controllers.

### Serilog
Logs estruturados com correlation id e redaction de dados sensíveis.

### OpenAPI
Documentação de contratos; exemplos e códigos de erro devem refletir a API real.

### Autenticação
JWT access token curto + refresh token rotacionável e revogável. Hash de senha com ASP.NET Core PasswordHasher ou Argon2id se uma biblioteca madura for adotada.

### Cache/Jobs
Redis e Hangfire somente se uma TASK comprovar necessidade. MVP pode iniciar com memória/local para cache não crítico e `BackgroundService` para dispatch de webhook, migrando quando necessário.

## Infraestrutura

- Docker e Docker Compose para API + PostgreSQL (+ Redis opcional).
- GitHub Actions para lint, test e build.
- Imagens multi-stage.
- Reverse proxy/hosting com HTTPS obrigatório.
- `.env.example` apenas com placeholders.
- Health checks `/health/live` e `/health/ready`.
- OpenTelemetry opcional na fase de observabilidade.

## Política de dependências

1. Preferir recursos nativos do framework.
2. Adicionar biblioteca apenas quando reduzir complexidade real.
3. Fixar major/minor conforme lockfile.
4. Dependência abandonada ou com vulnerabilidade crítica bloqueia release.
5. Toda nova dependência relevante deve ser registrada em ADR.
