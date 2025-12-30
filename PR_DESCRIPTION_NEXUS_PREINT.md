# feat(triad): production-first compose wiring for shield+chronos+conductor

## Resumo
Esta PR materializa a tríade operacional no Ozzmosis em modo production-first, garantindo que:

- `butantan-shield` compila e sobe em Docker “clean room” (tipagem Node explícita e adapter Node no Elysia).
- `chronos-backoffice` roda em modo shield sem “shield_missing” (wiring de `SHIELD_URL/SHIELD_TOKEN` via compose/env).
- `aurora-conductor-service` integra no mesmo compose e responde a health/compose.
- Imagens Docker incluem dependências necessárias em runtime, evitando `ERR_MODULE_NOT_FOUND`.

## Mudanças principais

### 1) Shield (apps/butantan-shield)

- Tipagem Node explícita (`@types/node` + `types:["node"]`) para build reprodutível em Docker/CI.
- Endpoints:
	- `GET /health`
	- `GET /proxy/projects`
	- `GET /proxy/tasks`
- Autorização via Bearer token opcional (`SHIELD_TOKEN`).

### 2) Docker/Tríade

- `docker/compose.triad.dev.yml` atualizado para subir:
	- butantan-shield
	- chronos-backoffice
	- aurora-conductor-service
- `.env.triad.example` inclui `SHIELD_TOKEN` e variáveis de portas.
- `.gitignore` garante que `docker/.env.triad` nunca seja versionado.

### 3) Dockerfiles

- Ajustes para garantir dependências em runtime dentro das imagens (sem assumir apenas root node_modules).

## Como validar (local)

### 1) Criar env local (não versionado)

- Copiar `docker/.env.triad.example` → `docker/.env.triad`
- Preencher `SHIELD_TOKEN` (ex.: `local-dev-token`)

### 2) Subir do zero

```bash
docker compose -f docker/compose.triad.dev.yml --env-file docker/.env.triad down --remove-orphans --volumes
docker compose -f docker/compose.triad.dev.yml --env-file docker/.env.triad build --no-cache
docker compose -f docker/compose.triad.dev.yml --env-file docker/.env.triad up -d
docker compose -f docker/compose.triad.dev.yml --env-file docker/.env.triad ps
```

### 3) Provas

```bash
curl -i http://localhost:4001/health
curl -i -H "Authorization: Bearer <SHIELD_TOKEN>" http://localhost:4001/proxy/projects
curl -i -H "Authorization: Bearer <SHIELD_TOKEN>" http://localhost:4001/proxy/tasks
curl -i http://localhost:3000/api/projects
curl -i http://localhost:3000/api/tasks
```

## Critérios de aceite

- `docker compose ... ps` mostra Shield e Conductor `healthy` e Chronos `up`.
- `GET /health` do Shield retorna 200.
- `GET /proxy/projects` e `/proxy/tasks` retorna 200 com token correto.
- Chronos responde `/api/projects` e `/api/tasks` com `ok:true` (sem `shield_missing`).

## Risco/Notas

- Esta PR intentionally enrijece o contrato: build e runtime precisam ser reprodutíveis em ambiente limpo (Docker/CI), sem dependências implícitas do host.

