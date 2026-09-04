# Infraestrutura do PayFlow

Esta pasta contém os artefatos de infraestrutura, conteinerização e orquestração local do projeto.

## Estrutura
- `docker/`: Dockerfiles multi-stage para cada aplicação (`api`, `admin-web`, `checkout-web`).
- `compose/`: Definições do Docker Compose para execução do ambiente local (PostgreSQL, API, etc.).
