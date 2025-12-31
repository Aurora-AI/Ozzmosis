# POLICY — Trustware (Ozzmosis)

Objetivo: mitigar risco operacional e prompt injection em agentes dentro do repo.

## 1) Regra de ouro
Qualquer comando fora do allowlist exige confirmação humana explícita.

## 2) Allowlist (permitido sem confirmação)
Leitura/diagnóstico:
- cat, type, less, more
- ls, dir, tree
- git status, git diff, git show, git log
- grep, rg (ripgrep), findstr
- npm -v, node -v

Gates e build (não destrutivos):
- npm ci
- npm install --package-lock-only
- npm -w <workspace> run build|lint|typecheck|test
- npm run repo:check|repo:clean (repo:clean exige cuidado: se houver risco, pedir confirmação)
- docker compose -f ... config
- docker compose -f ... build
- docker compose -f ... up -d
- docker compose -f ... ps
- curl (apenas para endpoints locais do compose)

## 3) Denylist (proibido sem confirmação humana)
Sistema/arquivos:
- rm, rmdir, del, format, mkfs
- chmod/chown recursivo fora de contexto
- mover/deletar pastas inteiras sem justificativa

Git perigoso:
- git push
- git reset --hard
- git rebase
- git cherry-pick
- git clean -fdx
- force-push

Docker perigoso:
- docker system prune
- docker volume rm (fora do compose down controlado)
- limpar imagens indiscriminadamente

Credenciais e segredos:
- editar `.env*` versionados (ex.: exemplos) sem revisão humana
- copiar tokens reais para arquivos commitáveis
- imprimir secrets em logs

## 4) Política de logs
- Nunca logar tokens, cookies, chaves.
- Sanitizar saídas quando necessário.

## 5) Resultado esperado
Agente opera com alto rigor, baixa agressividade e alta reprodutibilidade.

