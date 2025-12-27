# Manual do Produto — Ozzmosis (Fábrica Aurora)

## Para pessoas “normais” (Gestão / Comercial / Produto)

### O que é
Ozzmosis é a Fábrica da Aurora: um repositório que funciona como ambiente de construção governado. Aqui nós não “programamos solto”; nós fabricamos componentes e produtos com disciplina.

### Por que existe
Para evitar legado, experimentos soltos e regressões. Ozzmosis faz o ecossistema evoluir com:
- contexto (documentos canônicos),
- governança (Conductor),
- repetibilidade (gates + skills),
- rastreabilidade (histórico versionado + manifesto de Vault).

### O que ele entrega agora
- Um Kernel (Aurora Conductor) estável e validado.
- Um processo produtivo replicável (Constituição + Skills).
- Um segundo pilar (Chronos) nascendo com rigor (scaffold governado).

### O que ele NÃO é (ainda)
- Não é o CRM.
- Não é o Jurídico.
- Não é a consultoria 24x7.
Esses serão produtos construídos depois, sobre a fábrica.

## Para devs e LLMs (Execução e Integração)

### Contrato do repo
- Instalação canônica: `npm ci` na raiz.
- Gates definem verdade: se falhar no CI, não entra.
- Side-effects por padrão = zero.

### Comandos canônicos
#### Conductor
- build/typecheck/lint/smoke/survival

#### Repo contract
- `npm run repo:check`
- `npm run repo:clean`

#### Chronos (menção; evolução em OS própria)
- `npm run chronos:build`
- `npm run chronos:smoke`

#### DX (quando `npm ci` falhar por lock local)
- `npm run install:clean`

### Agent Skills
Use `agent-skills/` para executar tarefas sem reexplicar contexto.
Skills iniciais:
- repo-guardian
- conductor-guardian
- doc-curator
- chronos-bootstrap

### Regra de SSOT (Vault)
Tudo que é canônico deve ser espelhado no Vault (Google Drive) conforme `docs/Vault_SSoT_MANIFEST.md`.
