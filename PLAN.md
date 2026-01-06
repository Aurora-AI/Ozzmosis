# PLAN — OS-004-ACCEPTANCE-CRITERIA
Data: 2026-01-05
Autor: agent

---

# PLAN — OS-CODEX-RODOBENS-ULTIMATE-EXECUTION-20260106-019
Data: 2026-01-06
Autor: agent

## Objetivo
Materializar o DMI Rodobens Wealth com SSOT no Vault, pipeline PDF->Markdown
deterministico e contratos documentais (policies + estados).

## Escopo
Inclui:
- Estrutura SSOT em `apps/ozzmosis/data/vault/rodobens-wealth`.
- Docs canonicos (README, policies, diagramas, OS).
- CLI deterministica `scripts/rodobens/pdf2md`.

Nao inclui:
- OCR real (fica como stub governado).
- Dependencias novas fora do requirements local.
- Execucao do pipeline em fontes reais.

## Riscos
- R1: Diretorios vazios nao entram no git. Mitigacao: `.gitkeep`.
- R2: Texto com acentuacao fora do padrao. Mitigacao: manter ASCII.

## Passos (executar 1 por vez)
1) Criar Vault Rodobens Wealth + docs canonicos
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/rodobens-wealth/README.md`
     - `apps/ozzmosis/data/vault/rodobens-wealth/policies/trustware_rules.yaml`
     - `apps/ozzmosis/data/vault/rodobens-wealth/diagrams/cinematic_states.md`
     - `apps/ozzmosis/data/vault/rodobens-wealth/os/OS-CODEX-RODOBENS-ULTIMATE-EXECUTION-20260106-019.md`
     - `apps/ozzmosis/data/vault/rodobens-wealth/sources/_inbox/.gitkeep`
     - `apps/ozzmosis/data/vault/rodobens-wealth/knowledge/_generated/.gitkeep`
     - `apps/ozzmosis/data/vault/rodobens-wealth/knowledge/_index/.gitkeep`
     - `apps/ozzmosis/data/vault/rodobens-wealth/evidence/.gitkeep`
   - Criterios de aceite:
     - Estrutura do Vault criada com SSOT e docs canonicos.
     - Politicas Trustware iniciais em YAML.
     - Gates passam.

2) Criar CLI pdf2md (deterministica e idempotente)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `scripts/rodobens/pdf2md/requirements.txt`
     - `scripts/rodobens/pdf2md/README.md`
     - `scripts/rodobens/pdf2md/pdf2md.py`
   - Criterios de aceite:
     - Script gera MD com front-matter e hashes.
     - Nenhum acoplamento exclusivo a CUDA.
     - Gates passam.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`

# PLAN — TRUSTWARE-HEALTH-BOOT-LOGS
Data: 2026-01-05
Autor: agent

## Objetivo
Enriquecer o payload de `/health` e adicionar log de boot do Trustware com
metadados minimos para operacao e forensics.

## Escopo
Inclui:
- Adicionar `health_snapshot()` no engine Trustware.
- Atualizar `/health` com payload canonico.
- Logar uma linha no boot com path/version/produtos.

Nao inclui:
- Mudancas em regras YAML.
- Novas dependencias.
- Ajustes em outras rotas.

## Riscos
- R1: Falha ao ler mtime pode quebrar health. Mitigacao: captura de excecao e retorno `None`.
- R2: Log duplicado em reloads. Mitigacao: manter log apenas no boot.

## Passos (executar 1 por vez)
1) Implementar snapshot e health/log de boot
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/alvaro-core/services/trustware/engine.py`
     - `apps/alvaro-core/main.py`
   - Criterios de aceite:
     - `/health` retorna `trustware.template_version` e `trustware.rules_path`.
     - Boot loga `trustware_boot:` com version/produtos/path.
     - Falha em YAML nao sobe e loga `trustware_boot_failed`.

## Gates
- `scripts/agents/run-gates.ps1`

## Rollback
- `git revert <sha>`

## Objetivo
Implementar os criterios de aceite da OS-004 na Genesis Front (sem alterar URL),
com transicao Standard -> Legacy, densidade atmosferica e reacao a inputs por
composicao de instrumentos (nao por valor absoluto).

## Escopo
Inclui:
- Atualizar `apps/genesis-front/src/app/page.tsx` com estado de modo e transicao suave.
- Ajustar navegacao para modo Legacy (indicadores de seguranca).
- Reagir a composicao de instrumentos (Legacy destacado ao selecionar 2+ itens complexos).

Nao inclui:
- Mudancas em backend ou rotas.
- Novas dependencias NPM.
- Refactors fora da pagina inicial.

## Riscos
- R1: Transicao visual pode conflitar com estilos globais. Mitigacao: aplicar classes apenas no container principal.
- R2: Scroll smooth pode conflitar com Lenis. Mitigacao: manter comportamento simples e idempotente.

## Passos (executar 1 por vez)
1) Implementar criterios de aceite na home
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/genesis-front/src/app/page.tsx`
   - Criterios de aceite:
     - Sem mudanca de URL ao ativar o protocolo.
     - Scroll suave para o topo ao iniciar protocolo.
     - Modo Legacy altera densidade de informacao e navegacao.
     - Card Legacy destaca automaticamente quando patrimonio > R$ 10M.
     - Gates passam.

## Gates
- `npm ci`
- `npm run repo:check`

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — ADR-UNIFIED-VIP-001
Data: 2026-01-05
Autor: agent

## Objetivo
Formalizar a constituicao "VIP unificado" no repositorio, em `docs/CONSTITUICAO/`.

## Escopo
Inclui:
- Criar `docs/CONSTITUICAO/ADR-UNIFIED-VIP-001.md` com o texto canonico fornecido.

Nao inclui:
- Alteracoes em codigo de produto.
- Ajustes em outras documentacoes.

## Riscos
- R1: Conteudo divergente do texto canonico. Mitigacao: copiar literalmente o texto aprovado.

## Passos (executar 1 por vez)
1) Registrar ADR canônico
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
   - Arquivos:
     - `docs/CONSTITUICAO/ADR-UNIFIED-VIP-001.md`
   - Criterios de aceite:
     - Arquivo criado com conteudo canonico.

## Rollback
- `git revert <sha>`

---

# PLAN — OS-GENESIS-EMPATHY-005
Data: 2026-01-05
Autor: agent

## Objetivo
Implementar o "Whisper Engine" e o Composer de Instrumentos na home, com progressao
visual suave e ativacao consciente do protocolo.

## Escopo
Inclui:
- Atualizar `apps/genesis-front/src/app/page.tsx` com estado de instrumentos,
  feedback efemero e card Legacy com intensificacao progressiva.

Nao inclui:
- Mudancas em rotas/URLs.
- Mudancas em backend ou contrato de dados.
- Novas dependencias NPM.

## Riscos
- R1: Mensagem efemera persistir entre renders. Mitigacao: timeout com limpeza.
- R2: Ativacao VIP automatica indevida. Mitigacao: manter clique explicito.

## Passos (executar 1 por vez)
1) Implementar Composer + Whisper
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/genesis-front/src/app/page.tsx`
   - Criterios de aceite:
     - Feedback de empatia exibido e auto-limpo.
     - Card Legacy intensifica com 2+ instrumentos.
     - Transicao para VIP somente por clique.
     - Gates passam.

## Gates
- `npm ci`
- `npm run repo:check`

## Rollback
- `git revert <sha>`

---

# PLAN — OS-GENESIS-ALIGN-001
Data: 2026-01-05
Autor: agent

## Objetivo
Alinhar `apps/genesis-front` à estrutura `src/` e transplantar o motor visual White Absolute
para a home da Aurora Genesis (atmosfera, tipografia e organismo principal), mantendo
o motor de scroll Lenis existente (sem ReactLenis).

## Escopo
Inclui:
- Mover `apps/genesis-front/app` para `apps/genesis-front/src/app`.
- Mover `apps/genesis-front/components` para `apps/genesis-front/src/components`.
- Atualizar `apps/genesis-front/tsconfig.json` para `@/*` apontar para `./src/*`.
- Substituir `apps/genesis-front/src/app/globals.css` com grain/spotlight/reveal e tokens White Absolute.
- Manter o componente `apps/genesis-front/src/components/SmoothScroll.tsx`.
- Atualizar `apps/genesis-front/src/app/layout.tsx` com Playfair Display e classes globais (body/html).
- Reescrever `apps/genesis-front/src/app/page.tsx` com estrutura Hero/Life Map/Showcase/Footer e reveal.

Não inclui:
- Mudanças em outras apps (`chronos-backoffice`, `mycelium-front`).
- Novas dependências NPM ou ajustes em Tailwind config.
- Alterações em workflows/Dockerfiles/configs fora do escopo.

## Riscos
- R1: Comandos de move (`Move-Item`) não estão no allowlist Trustware. Mitigação: executar somente com confirmação humana explícita.
- R2: Troca de `@import 'tailwindcss'` por diretivas `@tailwind` pode quebrar o build (Tailwind v4). Mitigação: manter `@import 'tailwindcss'` no topo ao substituir o CSS.
- R3: Alias `@/*` pode quebrar imports se não apontar para `./src/*`. Mitigação: ajustar `tsconfig.json`.
- R4: Interseção/reveal pode não ativar em navegadores antigos. Mitigação: fallback aceitável (elementos permanecem visíveis se `active` for aplicado manualmente).
 - R5: Mudança para ReactLenis conflita com React 19 (peer deps). Mitigação: manter Lenis atual.

## Passos (executar 1 por vez)
1) Alinhamento de estrutura `src/`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `New-Item -ItemType Directory -Path apps\genesis-front\src`
     - `Move-Item -Path apps\genesis-front\app -Destination apps\genesis-front\src\app`
     - `Move-Item -Path apps\genesis-front\components -Destination apps\genesis-front\src\components`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/genesis-front/src/app/*`
     - `apps/genesis-front/src/components/*`
     - `apps/genesis-front/tsconfig.json`
   - Critérios de aceite:
     - Estrutura `apps/genesis-front/src/app` e `apps/genesis-front/src/components` existente.
     - `@/*` aponta para `./src/*` em `apps/genesis-front/tsconfig.json`.
     - Gates passam.

2) Atmosfera global (globals.css)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/genesis-front/src/app/globals.css`
   - Critérios de aceite:
     - CSS substituído com `grain`, `hero-spotlight`, `reveal`, `hover-luxury` e `@theme`.
     - Gates passam.

3) Motor de scroll Lenis (existente) + layout base
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/genesis-front/src/components/SmoothScroll.tsx`
     - `apps/genesis-front/src/components/index.ts`
     - `apps/genesis-front/src/components/LenisProvider.tsx`
     - `apps/genesis-front/src/app/layout.tsx`
   - Critérios de aceite:
     - SmoothScroll mantém Lenis existente.
     - Playfair Display importada e aplicada via variável CSS.
     - `<body>` aplica classes globais do briefing.
     - Gates passam.

4) Organismo principal (page.tsx)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/genesis-front/src/app/page.tsx`
   - Critérios de aceite:
     - Estrutura Hero/Life Map/Showcase/Footer conforme briefing.
     - Lógica de reveal ativa sem imports mortos.
     - Gates passam.

## Gates
- `npm ci`
- `npm run repo:check`

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — AURORA-GENESIS-SKIN-TRANSPLANT-20260105-001
Data: 2026-01-05
Autor: agent

## Objetivo
Aplicar a “Golden Copy” (White Absolute) no `apps/genesis-front`, transplantando Atmosfera (grain + spotlight), Física (cubic-bezier `0.16, 1, 0.3, 1`) e Tipografia híbrida (Inter + Playfair Display), e removendo qualquer vestígio de theme toggle (Aurora imutável).

## Escopo
Inclui:
- Substituir `apps/genesis-front/app/globals.css` pela base “White Absolute” (mantendo Tailwind v4 via `@import 'tailwindcss';`).
- Atualizar `apps/genesis-front/app/layout.tsx` para adicionar `Playfair_Display` e aplicar as classes `grain` + `font-sans`.
- Substituir `apps/genesis-front/app/page.tsx` pelo organismo “Aurora Genesis” com `reveal` via `IntersectionObserver`.

Não inclui:
- Mudança de dependências NPM.
- Ajustes em `components/*` (exceto o uso do `SmoothScroll` já existente).
- Commits/push (fora do allowlist Trustware).

## Riscos
- R1: Divergência de diretivas Tailwind (v4). Mitigação: usar `@import 'tailwindcss';` no `globals.css`.
- R2: Import path do `SmoothScroll` divergente. Mitigação: manter o import existente `@/components/SmoothScroll`.
- R3: CSS global anterior continha utilitários (`.container`) usados por componentes antigos. Mitigação: `app/page.tsx` não usa mais esses componentes.
- R4: `npm ci` pode falhar no Windows com `EPERM unlink` se o VS Code/Extensões estiverem com lock em `node_modules` (ex.: Tailwind oxide). Mitigação: fechar instâncias do VS Code que estejam com o repo aberto e re-rodar os gates.

## Passos (executar 1 por vez)
1) Atmosfera — substituir `apps/genesis-front/app/globals.css`
   - Mudanças:
     - Definir tokens (`--bg`, `--fg`, `--line`, etc.), `grain`, `hero-spotlight`, `reveal`, `hover-luxury` e `.font-serif`.
   - Comandos (gates):
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - `scripts\agents\run-gates.ps1` retorna `Gates PASS`

2) Tipografia — atualizar `apps/genesis-front/app/layout.tsx`
   - Mudanças:
     - Importar `Playfair_Display` via `next/font/google`.
     - Aplicar `${inter.variable} ${playfair.variable}` e `grain` no `<body>`.
   - Comandos (gates):
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - `scripts\agents\run-gates.ps1` retorna `Gates PASS`

3) Organismo — substituir `apps/genesis-front/app/page.tsx`
   - Mudanças:
     - Página “Aurora Genesis” com navegação fixa, hero (spotlight + serif), life map (sliders) e showcase (cards).
   - Comandos (gates):
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - `scripts\agents\run-gates.ps1` retorna `Gates PASS`

## Gates
- `scripts\agents\run-gates.ps1` após cada passo.

## Rollback
- Reverter os 3 arquivos alterados para o estado anterior (via git, com execução humana se necessário) e re-rodar `scripts\agents\run-gates.ps1`.

# PLAN — ESLint root config + VS Code monorepo fix

Objetivo: eliminar o erro do VS Code ESLint (`Could not find config file`) garantindo um config raiz do ESLint (Flat Config) e ajustes mínimos de monorepo no workspace.

## Passos

1) Fixar dependencias ESLint/TS no root (package.json + lockfile)
   - Mudancas:
     - Atualizar `package.json` com devDependencies do ESLint/TS
     - Atualizar `package-lock.json` para refletir o root devDependencies
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `scripts\agents\run-gates.ps1` passa

2) Atualizar flat config com TypeScript ESLint (root)
   - Mudancas:
     - Atualizar `eslint.config.mjs` com `@eslint/js`, `globals`, parser e plugin TS
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `scripts\agents\run-gates.ps1` passa

3) Ajustar settings do VS Code (monorepo + flat config)
   - Mudancas:
     - Atualizar `.vscode/settings.json` (mesclar chaves ESLint sem remover as existentes)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `scripts\agents\run-gates.ps1` passa

4) Verificacoes deterministicas (hard check)
   - Mudancas:
     - Nenhuma (somente verificacao)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `node -p "require.resolve('eslint/package.json')"`
     - `npx eslint --print-config apps/aurora-conductor-service/package.json > NUL`
     - `echo $LASTEXITCODE`
     - `npx eslint apps/aurora-conductor-service --ext .ts,.tsx,.js,.json`
     - `echo $LASTEXITCODE`
     - `scripts\agents\run-gates.ps1`
     - `echo "EXITCODE=$LASTEXITCODE"`
   - Criterios de aceite:
     - Provas 1-3 sem erro fatal de config/parsing
     - Gates retornam `EXITCODE=0`

5) Suporte definitivo a JSON no ESLint
   - Mudancas:
     - Adicionar `jsonc-eslint-parser` como devDependency no root
     - Atualizar `eslint.config.mjs` para usar parser JSON
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `npm i -D jsonc-eslint-parser`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates retornam `EXITCODE=0`

6) Repetir Prova 3 (lint do app com JSON)
   - Mudancas:
     - Nenhuma (somente verificacao)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `npx eslint apps/aurora-conductor-service --ext .ts,.tsx,.js,.json`
     - `echo $LASTEXITCODE`
   - Criterios de aceite:
     - Sem erro de parsing/config para JSON/TS

---

# PLAN — AURORA-GENESIS-HERO-FANTASY-005
Data: 2026-01-05
Autor: agent

## Objetivo
Refinar o Hero de `apps/genesis-front` para tipografia com “Ar e Autoridade” (peso/leading/tracking) e ajustar o smooth scroll via Lenis para fluidez cinematográfica.

## Escopo
Inclui:
- Atualizar `apps/genesis-front/components/Hero.tsx` para layout centrado, tracking negativo e contraste `font-extralight` vs `font-normal`.
- Ajustar o wrapper de scroll em `apps/genesis-front/app/layout.tsx` com um componente `SmoothScroll` (Lenis) e opções equivalentes às do briefing.

Não inclui:
- Novas dependências NPM.
- Mudanças em outras seções (Decision Space / Life Map / Proposals / Acceptance).
- Refactors gerais de animações/estilos fora do Hero.

## Riscos
- R1: Regressão visual em breakpoints (mobile/desktop). Mitigação: manter classes Tailwind responsivas e validar rapidamente o layout manualmente.
- R2: Lenis interferir com `scrollIntoView({ behavior: 'smooth' })`. Mitigação: manter configuração conservadora; se houver conflito, ajustar a navegação para `behavior: 'auto'` ou usar `lenis.scrollTo` em passo separado.

## Passos (executar 1 por vez)
1) Reconstruir o Hero (Fantasy.co)
   - Comandos (gates):
     - `cd C:\\Aurora\\Ozzmosis`
     - `npm ci`
     - `npm run repo:check`
   - Arquivos:
     - `apps/genesis-front/components/Hero.tsx`
   - Critérios de aceite:
     - `npm run repo:check` passa
     - Hero compila e renderiza sem erro de runtime

2) Smooth scroll (Lenis) via `SmoothScroll` no layout
   - Comandos (gates):
     - `cd C:\\Aurora\\Ozzmosis`
     - `npm ci`
     - `npm run repo:check`
   - Arquivos:
     - `apps/genesis-front/components/SmoothScroll.tsx` (novo)
     - `apps/genesis-front/app/layout.tsx`
     - `apps/genesis-front/components/index.ts`
     - `apps/genesis-front/components/LenisProvider.tsx` (ajuste mínimo/compat)
   - Critérios de aceite:
     - `npm run repo:check` passa

## Gates
- `npm ci`
- `npm run repo:check`

## Rollback
- Reverter via git (exige confirmação humana se fora do allowlist Trustware):
  - `git revert <sha>`
  - `npm ci && npm run repo:check`
# PLAN — OS-ANTIGRAVITY-GENESIS-REBUILD-004
Data: 2026-01-04
Autor: agent

## Objetivo
Encerrar a OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003 como "execucao revertida" (fonte perdida no workspace) e reconstruir `apps/genesis-front` com fonte versionada (Next App Router + Lenis + framer-motion) e handshake real de API via `NEXT_PUBLIC_ALVARO_API_BASE_URL`.

## Escopo
Inclui:
- Atualizar `docs/os/OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003.md` (forense + conclusao).
- Criar `docs/os/OS-ANTIGRAVITY-GENESIS-REBUILD-004.md` (OS nova + criterios).
- Rebuild de `apps/genesis-front` com fonte (package.json + app/ + components/ + lib/api.ts).
- Proxy/rewrite de DEV no Next para evitar CORS local sem mudar backend.
Nao inclui:
- Alteracoes no backend/API.

## Riscos
- R1: Deletar `apps/genesis-front` (artefatos) exige confirmacao humana e pode apagar `.env.local` local.
- R2: Dependencias (next/react/lenis/framer-motion) exigem lockfile unico no root e gates verdes.
- R3: CORS local pode bloquear handshake; proxy deve ser DEV-only e sem impacto em prod.

## Passos (executar 1 por vez)
1) Fechar OS-003 + abrir OS-004 (docs)
   - Mudancas:
     - Atualizar `docs/os/OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003.md`
     - Criar `docs/os/OS-ANTIGRAVITY-GENESIS-REBUILD-004.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts/agents/run-gates.ps1`
   - Criterios de aceite:
     - OS-003 marcada como execucao revertida e inclui evidencias (timestamps + ausencia de fonte)
     - OS-004 criada com entregaveis + como rodar
     - Gates passam

2) (Confirmacao humana obrigatoria) Higienizar `apps/genesis-front` e recriar com fonte Next (App Router)
   - Mudancas:
     - Remover artefatos (`.next/`, `node_modules/`, `.env.local`, `next-env.d.ts`) e garantir fonte real em disco.
     - Criar `apps/genesis-front/package.json`, `app/**`, `components/**`, `lib/api.ts`.
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `Remove-Item -Recurse -Force apps/genesis-front` (exige confirmacao humana)
     - `New-Item -ItemType Directory apps/genesis-front`
     - `apply_patch` (criar arquivos base do app)
     - `npm install --package-lock-only`
     - `npm -w apps/genesis-front run build`
     - `npm -w apps/genesis-front run typecheck`
     - `scripts/agents/run-gates.ps1`
   - Criterios de aceite:
     - `apps/genesis-front/package.json` existe
     - `apps/genesis-front/app` existe
     - Build e typecheck do workspace passam
     - Gates passam

3) Implementar Impact Light + Golden Path (Hero -> Acceptance)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts/agents/run-gates.ps1`
   - Criterios de aceite:
     - Estados existem e estao navegaveis via scroll

4) Integrar Deep Scroll (Lenis) + transicoes (framer-motion)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts/agents/run-gates.ps1`
   - Criterios de aceite:
     - Lenis ativo globalmente
     - Transicoes por estado com motion (opacity/scale)

5) Handshake real com API + proxy DEV (sem mexer no backend)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts/agents/run-gates.ps1`
   - Criterios de aceite:
     - `NEXT_PUBLIC_ALVARO_API_BASE_URL` usado em `lib/api.ts`
     - Rewrites/proxy evita CORS local quando necessario

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>` (por passo/commit)
- `scripts/agents/run-gates.ps1`

---

# PLAN — OS-OZZMOSIS-STT-HARDENING-WRAPPER-20260102-003
Data: 2026-01-02
Autor: agent

## Objetivo
Padronizar a execucao operacional do ToolBelt STT (elysian-transcribe) no Windows com:
- wrapper PowerShell deterministico (ffmpeg + venv + CLI + logs)
- outdir por rodada no Vault Rodobens
- playbook atualizado com comandos recomendados

## Escopo
Inclui:
- `scripts/elysian-transcribe.ps1` (wrapper)
- Atualizar `apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md`
- Criar pasta de execucoes no Vault de transcripts (se necessario)
Nao inclui:
- Integracao com Chronos para indexar transcripts automaticamente
- Dados reais de audio no repo

## Riscos
- R1: PATH do ffmpeg varia por maquina/sessao; wrapper precisa localizar/install detectavel.
- R2: Logs nao podem vazar conteudo sensivel; logar apenas metadados.
- R3: Dependencias Python nao fazem parte dos gates Node; validar por smoke local e gates do repo.

## Passos (executar 1 por vez)
1) Implementar wrapper e padrao de outputs no Vault
   - Mudancas:
     - Adicionar `scripts/elysian-transcribe.ps1`
     - Atualizar playbook do Vault Rodobens com comandos e recomendacoes
     - Criar `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/_runs/.gitkeep` (se necessario)
     - Atualizar `.gitignore` para evitar commit acidental de outputs reais (SRT/VTT/JSON) sob `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Wrapper executa `--help` e valida ffmpeg/venv
     - `git status -sb` nao lista outputs de transcricao sob o Vault
     - Gates passam

2) Commit e push (unico) do hardening STT
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add scripts/elysian-transcribe.ps1 apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md apps/ozzmosis/data/vault/rodobens/trainings/transcripts/_runs/.gitkeep .gitignore`
     - `git commit -m "chore(stt): add windows wrapper + vault runbook for elysian-transcribe"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Criterios de aceite:
     - `git status -sb` limpo
     - Gates passam

## Gates
- `scripts\agents\run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `scripts\agents\run-gates.ps1`

---

# PLAN — OS-OZZMOSIS-STT-MD-EXPORT-20260102-005
Data: 2026-01-02
Autor: agent

## Objetivo
Exportar o texto bruto das transcricoes para `.md` (sem `id/start/end`) automaticamente, e gerar `.md` para os 5 arquivos de teste atuais.

## Escopo
Inclui:
- Atualizar o ToolBelt STT para escrever `<stem>.md` com texto bruto por default
- Adicionar opcao de desligar export (`--no-md`) para casos especiais
Nao inclui:
- Commitar outputs de transcricao no repo (devem permanecer ignorados)

## Passos (executar 1 por vez)
1) Implementar export Markdown (texto bruto) no toolbelt
   - Mudancas:
     - Atualizar `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `.\.venv\Scripts\python.exe -m pytest libs\elysian-brain\tests -q`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - CLI gera `<stem>.md` junto com `.srt/.vtt/*_transcript.json`
     - Testes e gates passam

2) Gerar `.md` para os 5 transcripts atuais (local-only)
   - Mudancas:
     - Nenhuma em arquivos versionados (somente gerar `.md` em `_runs/`)
   - Comandos:
     - Rodar conversao dos 5 `*_transcript.json` em `.md` na mesma pasta
   - Criterios de aceite:
     - Para cada arquivo: existe `<stem>.md` com texto bruto
     - `git status -sb` continua limpo

3) Commit e push (unico) do export `.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
     - `git commit -m "feat(stt): export raw transcript to markdown"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Criterios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-OZZMOSIS-STT-CPU-PERF-TUNING-20260102-006
Data: 2026-01-02
Autor: agent

## Objetivo
Melhorar previsibilidade de performance no Windows sem CUDA (Intel Iris) ajustando:
- `cpu_threads` (CTranslate2 / faster-whisper)
- `num_workers`
- `batch_size` do `transcribe`

## Escopo
Inclui:
- Expor flags no CLI e no wrapper PowerShell
- Atualizar playbook com recomendação para Intel Iris (CPU tuning)
Nao inclui:
- Suporte a aceleração Intel via OpenVINO/DirectML (WP futuro, se necessário)

## Passos (executar 1 por vez)
1) Expor tuning CPU no toolbelt/CLI
   - Mudancas:
     - Atualizar `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `.\.venv\Scripts\python.exe -m pytest libs\elysian-brain\tests -q`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - `elysian-transcribe --help` lista `--cpu-threads`, `--workers`, `--batch-size`
     - Execução CPU funciona com defaults
     - Testes e gates PASS

2) Atualizar wrapper + playbook (Windows)
   - Mudancas:
     - Atualizar `scripts/elysian-transcribe.ps1` para passar tuning e defaults bons
     - Atualizar `apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md` com recomendações
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Wrapper aceita `-CpuThreads`, `-Workers`, `-BatchSize` e passa para o CLI
     - Gates PASS

3) Commit e push (unico) do tuning CPU
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py scripts/elysian-transcribe.ps1 apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md PLAN.md`
     - `git commit -m "chore(stt): add cpu perf tuning knobs (threads/workers/batch)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Criterios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

    # PLAN — OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003 (fechamento)
    Data: 2026-01-04
    Autor: agent

    ## Objetivo
    Materializar rastro auditavel da OS e preparar commit com trailer, sem incluir artefatos de build.

    ## Escopo
    Inclui:
    - Criar `docs/os/OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003.md`
    - Criar `docs/Vault/AURORA_CANONICAL_HISTORY.md`
    - Revisar pasta `apps/genesis-front` para garantir que apenas fontes/versionaveis sejam consideradas
    Nao inclui:
    - Gerar ou recuperar codigo-fonte faltante do Genesis Front (depende de fonte externa)
    - Comitar artefatos de build, node_modules ou env files

    ## Passos (executar 1 por vez)
    1) Materializar documentos de OS e historico canonic
       - Comandos:
         - Criar os arquivos em `docs/os/` e `docs/Vault/` com o conteudo fornecido
         - Conferir `git status -sb`
       - Criterios de aceite:
         - Arquivos criados com conteudo legivel em ASCII
         - `git status -sb` lista apenas os novos docs e a pasta existente `apps/genesis-front`

    2) Preparar commit com trailer e gates (apos disponibilizacao de fontes)
       - Comandos:
         - Remover artefatos de build nao rastreaveis (garantir `.gitignore` cobre .next/node_modules/.env)
         - `git add docs/os/OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003.md docs/Vault/AURORA_CANONICAL_HISTORY.md` (e fontes legitimas do Genesis Front quando disponiveis)
         - `scripts/agents/run-gates.ps1`
         - `git commit -m "chore(genesis-front): register atmospheric translation OS" -m "OS: OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003"`
         - `git push`
       - Criterios de aceite:
         - Gates passam
         - Working tree limpo e commit contendo trailer da OS

    ## Gates
    - scripts/agents/run-gates.ps1

    ## Rollback
    - git restore --staged <paths> && git checkout -- <paths> (antes do commit)
    - git revert <sha> (apos o commit)

# PLAN — OS-CODEX-AURORA-CRM-HEADLESS-GENESIS-20260103-004
Data: 2026-01-03
Autor: agent

## Objetivo
Materializar o CRM Headless Genesis (mínimo) com:
- Models `Contact` e `Deal`
- Endpoint de ingestão `/ingest/message` (sem LLM)
- Migração Alembic criando `crm_contacts` e `crm_deals` (JSONB no Postgres)

## Escopo
Inclui somente as tarefas 1..5 da OS (arquivos listados abaixo).
Não inclui UI, automação LLM, nem entidades extras.

## Passos (executar 1 por vez)
1) Criar/atualizar models e API de ingestão
   - Mudanças:
     - Criar/sobrescrever:
       - `apps/crm-core/src/models/contact.py`
       - `apps/crm-core/src/models/deal.py`
       - `apps/crm-core/src/api/v1/ingest.py`
     - Atualizar:
       - `apps/crm-core/src/main.py` (registrar `ingest_router` sem prefix extra)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - App importa sem erro
     - `POST /ingest/message` existe (rota registrada)
     - Gates PASS

---

# PLAN — OS-CANONICALIZE-CRM-OS-004-005-20260103-007
Data: 2026-01-03
Autor: agent

## Objetivo
Versionar no Vault (SSOT) as duas OS canônicas:
1) Fechamento OS 004 (CRM Headless Genesis)
2) OS 005 pronta para execução (Ingest Persistence + Evento Canônico)

## Passos (executar 1 por vez)
1) Criar OS no Vault
   - Mudanças:
     - Adicionar:
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HEADLESS-GENESIS-20260103-004.md`
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-INGEST-PERSISTENCE-20260103-005.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Arquivos existem com conteúdo fechado (sem lacunas)
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HEADLESS-GENESIS-20260103-004.md apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-INGEST-PERSISTENCE-20260103-005.md PLAN.md`
     - `git commit -m "chore(vault): canonicalize CRM OS 004 + OS 005"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL
Data: 2026-01-03
Autor: agent

## Objetivo
Implementar MHC Router + Worker blindado no CRM Headless:
- Payload normalizado (contrato rígido)
- Paralelismo via asyncio.gather (Safety + SRV stubs)
- Idempotência por status + lock
- Retry/backoff via `compute_next_retry`
- Extensão do Dispatcher com fetch/lock + mark_success/mark_failure
- Registrar OS 007 no Vault

## Passos (executar 1 por vez)
1) Implementar Router/Processors/Dispatcher/Worker + payload completo no ingest
   - Mudanças:
     - Adicionar:
       - `apps/crm-core/src/processors/base.py`
       - `apps/crm-core/src/processors/safety.py`
       - `apps/crm-core/src/processors/srv.py`
       - `apps/crm-core/src/services/router.py`
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL.md`
     - Atualizar:
       - `apps/crm-core/src/services/dispatcher.py` (adicionar métodos, manter compat)
       - `apps/crm-core/src/workers/outbox_worker.py` (sobrescrever)
       - `apps/crm-core/src/api/v1/ingest.py` (garantir `raw_content` + `metadata` no payload)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `py -3.11 -m compileall apps\crm-core\src`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Worker importa sem SyntaxError
     - Payload para Router sempre contém `trace_id`, `contact_id`, `raw_content`, `metadata`
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/src/processors/base.py apps/crm-core/src/processors/safety.py apps/crm-core/src/processors/srv.py apps/crm-core/src/services/router.py apps/crm-core/src/services/dispatcher.py apps/crm-core/src/workers/outbox_worker.py apps/crm-core/src/api/v1/ingest.py apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-HYPER-ROUTER-EXEC-20260103-007-FINAL.md PLAN.md`
     - `git commit -m "feat(crm-core): MHC router + idempotent outbox worker (OS 007)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B
Data: 2026-01-03
Autor: agent

## Objetivo
Desbloquear `ci-crm-core` (PR #19) corrigindo `ModuleNotFoundError: sqlalchemy` durante collection do pytest, adicionando SQLAlchemy (asyncio) às deps de teste do `crm-core`.

## Passos (executar 1 por vez)
1) Atualizar deps de teste do crm-core
   - Mudanças:
     - Atualizar `apps/crm-core/requirements-test.txt` adicionando `sqlalchemy[asyncio]`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - `apps/crm-core/requirements-test.txt` inclui `sqlalchemy[asyncio]>=2.0,<3`
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/requirements-test.txt PLAN.md`
     - `git commit -m "chore(crm-core): add sqlalchemy asyncio to test deps to fix CI import collection"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B (VAULT CLOSE)
Data: 2026-01-03
Autor: agent

## Objetivo
Registrar no Vault (SSOT) o fechamento canônico da OS 007B (hotfix CI do crm-core).

## Passos (executar 1 por vez)
1) Criar registro no Vault
   - Mudanças:
     - Adicionar `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Arquivo existe com evidências (branch/commit/gates)
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-AURORA-CRM-TEST-DEPS-SQLALCHEMY-20260103-007B.md PLAN.md`
     - `git commit -m "chore(vault): close CRM OS 007B (sqlalchemy test deps)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

---

# PLAN — OS-CODEX-CRM-BIOLOGICAL-STABILIZATION-IMPLANT-20260103-011-FINAL
Data: 2026-01-03
Autor: agent

## Objetivo
Implantar contratos, matemática determinística e governança de estados no `crm-core`:
- Schemas Pydantic (Constituição)
- Engine determinístico (Respiração)
- Máquina de estados (Coração)
- Testes mínimos para impedir regressão
- Registro no Vault (SSOT)

## Passos (executar 1 por vez)
1) Criar módulos e testes do CRM
   - Mudanças:
     - Adicionar:
       - `apps/crm-core/src/schemas/__init__.py`
       - `apps/crm-core/src/services/__init__.py`
       - `apps/crm-core/src/schemas/life_map.py`
       - `apps/crm-core/src/services/math_engine.py`
       - `apps/crm-core/src/services/state_machine.py`
       - `apps/crm-core/tests/test_math_engine.py`
       - `apps/crm-core/tests/test_pipeline_governor.py`
       - `apps/crm-core/PLAN.md`
       - `apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-CRM-BIOLOGICAL-STABILIZATION-IMPLANT-20260103-011-FINAL.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis\apps\crm-core`
     - `py -3.11 -m compileall src`
     - `py -3.11 -m pytest -q`
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Imports estáveis (`src.schemas.life_map`, `src.services.math_engine`, `src.services.state_machine`)
     - Testes PASS
     - Gates PASS

2) Commit e push (único)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/src/schemas/__init__.py apps/crm-core/src/services/__init__.py apps/crm-core/src/schemas/life_map.py apps/crm-core/src/services/math_engine.py apps/crm-core/src/services/state_machine.py apps/crm-core/tests/test_math_engine.py apps/crm-core/tests/test_pipeline_governor.py apps/crm-core/PLAN.md apps/ozzmosis/data/vault/aurora-crm/os/OS-CODEX-CRM-BIOLOGICAL-STABILIZATION-IMPLANT-20260103-011-FINAL.md PLAN.md`
     - `git commit -m "chore(crm-core): add life map schemas, deterministic math engine, and pipeline governor"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

2) Criar migração Alembic (contacts + deals)
   - Mudanças:
     - Adicionar nova migration em `apps/crm-core/alembic/versions/` criando:
       - `crm_contacts`
       - `crm_deals` + FK `contact_id -> crm_contacts.id`
       - colunas JSON com JSONB no Postgres (via `with_variant`)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Critérios de aceite:
     - Migration versionada no repo
     - Gates PASS

3) Commit e push (unico) da OS CRM Headless Genesis
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status -sb`
     - `git add apps/crm-core/src/models/contact.py apps/crm-core/src/models/deal.py apps/crm-core/src/api/v1/ingest.py apps/crm-core/src/main.py apps/crm-core/alembic/versions/* .gitignore PLAN.md`
     - `git commit -m "feat(crm-core): headless genesis (contacts, deals, ingest, migration)"`
     - `scripts\agents\run-gates.ps1`
     - `git push`
   - Critérios de aceite:
     - `git status -sb` limpo
     - Gates PASS

# PLAN — WP5 RBAC Clean-Room (crm-core)

Objetivo: implementar RBAC clean-room em `apps/crm-core` com motor determinístico deny-wins, auditoria mínima e pontos de integração (tests + FastAPI opcional), sem adicionar dependências novas no Node.

## Passos

1) Normalizar modelo + motor RBAC (compilável e determinístico)
   - Mudancas:
     - Corrigir `apps/crm-core/src/models/security.py` (campos exigidos pelo SSOT, default_factory para timestamp, remover imports duplicados)
     - Corrigir `apps/crm-core/src/security/authorize.py` (imports, store injetável opcional, auditoria inclui correlation_id + matched_rules)
     - Adicionar `__init__.py` mínimos para suportar imports via `src` no sys.path
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates passam

2) Adicionar testes unitários do motor (sem dependências externas)
   - Mudancas:
     - Criar `apps/crm-core/tests/test_authorize.py` usando `unittest`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates passam
     - Testes cobrem: allow, deny-wins, default deny, wildcard, scope

3) Integração FastAPI (opcional, import-safe)
   - Mudancas:
     - Criar `apps/crm-core/src/security/fastapi_integration.py` com:
       - `build_authz_router()` (endpoint /authz/check)
       - `RBACMiddleware` (enforce via headers `x-rbac-resource`/`x-rbac-action` + `x-principal-id`)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Gates passam

---

# PLAN — OS-ROTA-A-ENCERRAR-SSOT-20251231-003 (Freeze Evidence Pack)

Objetivo: congelar no Git (SSOT) o pacote mínimo de evidências da Rota A, sem interpretação, e registrar nota canônica no Chronos.

## Passos

1) WP1 — Consolidar evidências no repo (pasta canônica)
   - Mudancas:
     - Garantir que `C:\Aurora\Ozzmosis\_thirdparty_evidences\` contém:
       - `commits.txt`
       - `erxes_hits.txt`
       - `odoo_hits.txt`
       - `corteza_hits.txt`
     - Se `odoo_hits.txt` não existir, gerar de forma determinística a partir de `C:\Aurora\_thirdparty\odoo`.
   - Prova (PowerShell):
     - `$e = 'C:\Aurora\Ozzmosis\_thirdparty_evidences'`
     - `Get-ChildItem $e | Select-Object Name, Length | Format-Table -AutoSize`
     - `(Get-Item (Join-Path $e 'commits.txt')).Length`
     - `(Get-Item (Join-Path $e 'erxes_hits.txt')).Length`
     - `(Get-Item (Join-Path $e 'odoo_hits.txt')).Length`
     - `(Get-Item (Join-Path $e 'corteza_hits.txt')).Length`
   - Criterios de aceite:
     - Os 4 arquivos existem e `Length > 0`

2) WP2 — Congelar SSOT no Git (sem interpretação)
   - Mudancas:
     - Commit do diretório `_thirdparty_evidences/` contendo os 4 arquivos.
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status`
     - `git add _thirdparty_evidences`
     - `git commit -m "chore(thirdparty): freeze evidence pack (erxes/odoo/corteza) [ROTA-A]"`
     - `git log -1 --oneline`
   - Criterios de aceite:
     - Commit criado contendo os 4 arquivos

3) WP3 — Registro no Chronos (SSOT editorial)
   - Mudancas:
     - Criar `docs/chronos/THIRDPARTY_EVIDENCEPACK_ROTA_A.md` contendo:
       - data/hora
       - 3 SHAs (erxes/odoo/corteza) do `commits.txt`
       - paths dos 4 arquivos no repo
       - regra clean-room (“sem copiar código”)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git add docs/chronos/THIRDPARTY_EVIDENCEPACK_ROTA_A.md`
     - `git commit -m "chore(chronos): record ROTA-A evidence pack SSOT"`
     - `git log -1 --oneline`
   - Criterios de aceite:
     - Arquivo criado e commitado

---

# PLAN — OS-ROTA-B-MODELAGEM-CLEANROOM-20260101-001 (Specs SSOT)

Objetivo: produzir especificações implementáveis (sem copiar código) para Inbox/Conversas, Pipeline Vendas (Cotação→Proposta→Contrato + Approvals) e RBAC, com glossário de mapeamento; cada spec referencia explicitamente os SHAs em `_thirdparty_evidences/commits.txt`.

## Passos

1) Criar specs SSOT (arquivos)
   - Mudancas:
     - Criar:
       - `docs/specs/inbox_conversations_spec.md`
       - `docs/specs/pipeline_sales_b2g_spec.md`
       - `docs/specs/rbac_spec.md`
       - `docs/specs/glossary_cleanroom.md`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Specs implementáveis (campos, estados, invariantes, APIs mínimas)
     - Sem trechos de código third-party
     - Cada spec cita explicitamente SHAs do `commits.txt`
     - Gates passam

2) Commitar specs (SSOT)
   - Mudancas:
     - Commit contendo os 4 arquivos em `docs/specs/`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git add docs/specs`
     - `git commit -m "docs(specs): add clean-room specs (ROTA-B)"`
     - `git log -1 --oneline`
   - Criterios de aceite:
     - Commit criado

---

# PLAN — OS-CODEX-CHRONOS-POINT-TO-VAULT-20260102-003
Data: 2026-01-02
Autor: agent

## Objetivo
Conectar o Chronos ao Vault Ademicon para navegacao e indexacao SSOT, sem duplicar conteudo.

## Escopo
Inclui:
- Descobrir onde o Chronos vive e como indexa.
- Conectar o Vault Ademicon como root (preferencial) ou via stubs.
- Expor item de navegacao "Ademicon (Vault)".
- Rodar o index/build do Chronos para prova de indexacao.
- Registrar evidencias em `CHRONOS_LINK_STATUS.md`.
Nao inclui:
- Criar features novas.
- Alterar logica de negocio.
- Copiar a verdade para fora do Vault.
- Remediacao do erro npm EBUSY (OS humana separada).

## Riscos
- R1: Alterar configuracoes do Chronos sem conhecer o indexador pode quebrar a navegacao.
- R2: Duplicar conteudo (copiar arquivos) viola SSOT.
- R3: Gates nao executados apos cada passo podem violar o processo do repo.

## Passos (executar 1 por vez)
1) Descoberta do Chronos e indexador (somente leitura)
   - Comandos:
     - `dir apps`
     - `Get-ChildItem -Recurse apps | Select-Object -First 200`
     - `rg -n "index\\.json|frontmatter|yaml|metadata|generate.*index|build.*index|library" -S .`
     - `rg -n "Chronos" -S .`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum (somente leitura).
   - Criterios de aceite:
     - Identificar a pasta raiz do Chronos.
     - Identificar o script/rota que gera index/busca.
     - Gates passam.

2) Conectar Vault Ademicon ao Chronos (roots ou stubs)
   - Comandos:
     - `apply_patch` (ajustar config/roots ou criar stubs conforme achado)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Arquivos de config do Chronos (a definir na descoberta)
     - Possiveis stubs em `apps/<chronos>/content/vault/ademicon/**` (se necessario)
   - Criterios de aceite:
     - Chronos referencia o Vault Ademicon sem copiar conteudo.
     - Gates passam.

3) Expor navegacao minima (menu "Ademicon (Vault)")
   - Comandos:
     - `apply_patch` (ajustar nav do Chronos)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Arquivo(s) de navegacao do Chronos (a definir na descoberta)
   - Criterios de aceite:
     - Menu inclui item "Ademicon (Vault)" com link para `SSOT_STATES.md`.
     - Gates passam.

4) Prova de indexacao (smoke)
   - Comandos:
     - `<comando real do Chronos>` (ex.: `npm -w <chronos> run build` ou `npm -w <chronos> run index`)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Artefato de index/manifest do Chronos (gerado pelo build).
   - Criterios de aceite:
     - Index/manifest inclui ao menos 4 docs do Vault Ademicon.
     - Gates passam.

5) Registrar evidencias (CHRONOS_LINK_STATUS.md)
   - Comandos:
     - `apply_patch` (criar arquivo de status com evidencias)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ademicon/CHRONOS_LINK_STATUS.md`
   - Criterios de aceite:
     - Arquivo criado com data, caminho do Chronos, metodo de consumo, comandos e local do index.
     - Gates passam.

6) Commit e push (mudancas do Chronos + status)
   - Comandos:
     - `git add <arquivos alterados>`
     - `git status -sb`
     - `git commit -m "chore(chronos): link Ademicon vault to Chronos SSOT"`
     - `git push`
   - Arquivos:
     - Arquivos alterados do Chronos e `CHRONOS_LINK_STATUS.md`.
   - Criterios de aceite:
     - `git status -sb` limpo apos commit.
     - Commit criado com a mensagem especificada.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — OS-DIA-03-MOCK-MRS-ADEMICON-GOLD
Data: 2026-01-02
Autor: agent

## Objetivo
Gerar o Mock Integration Environment MRS (Maturity, Rhythm, Safety) com dados sintéticos Ademicon para Chronos/Conductor/Dashboard.

## Escopo
Inclui:
- Criar `apps/ozzmosis/data/mocks/ademicon/`.
- Criar README e projections.json.
- Gerar datasets `consultants_mrs.csv`, `chat_logs_srv.json`, `events_stream.json`.
Nao inclui:
- UI nova ou alteracoes em produtos fora Ademicon.
- Integracoes reais ou dependencias externas.

## Riscos
- R1: Distribuicoes (55/25/20 e 80/20) fora do especificado invalidam o mock.
- R2: Incoerencia entre scores e sinais quebra o modelo MRS.
- R3: Gates nao executados apos cada passo violam processo do repo.

## Passos (executar 1 por vez)
1) Criar estrutura do mock, README e projections.json
   - Comandos:
     - `apply_patch` (README.md e projections.json)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/README.md`
     - `apps/ozzmosis/data/mocks/ademicon/projections.json`
   - Criterios de aceite:
     - Arquivos criados com conteudo conforme OS.
     - Gates passam.

2) Gerar `consultants_mrs.csv` (500 consultores, distribuicao MRS)
   - Comandos:
     - `python` (gerador deterministico para CSV)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/consultants_mrs.csv`
   - Criterios de aceite:
     - 500 linhas de consultores + header.
     - Distribuicoes 55/25/20 e 80/20 atendidas.
     - Gates passam.

3) Gerar `chat_logs_srv.json` e `events_stream.json`
   - Comandos:
     - `python` (gerador deterministico a partir do CSV)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/chat_logs_srv.json`
     - `apps/ozzmosis/data/mocks/ademicon/events_stream.json`
   - Criterios de aceite:
     - Campos obrigatorios presentes e coerentes com MRS.
     - Gates passam.

4) Commit e push
   - Comandos:
     - `git add apps/ozzmosis/data/mocks/ademicon`
     - `git status -sb`
     - `git commit -m "chore(mocks): add Ademicon MRS mock dataset"`
     - `git push`
   - Arquivos:
     - `apps/ozzmosis/data/mocks/ademicon/**`
   - Criterios de aceite:
     - `git status -sb` limpo apos commit.
     - Commit criado com a mensagem especificada.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — OS-JULES-ELYBI-MIGRATION-PLAN-AND-STT-TOOLBELT-20260102-001
Data: 2026-01-02
Autor: agent

## Objetivo
Localizar o Elysian Brain no repo Elysian, decidir a integracao com Ozzmosis e entregar o ToolBelt STT como lib/CLI em `libs/elysian-brain`, com playbook e evidencias no Vault.

## Escopo
Inclui:
- Forense no repo `C:\\Aurora\\Elysian` (tree + inventario de pyproject/proto + referencias).
- Registrar forense e plano de integracao no Vault Ozzmosis.
- Criar `libs/elysian-brain` com ToolBelt STT e CLI.
- Criar playbook e estrutura de transcripts no Vault Rodobens.
- Registrar evidencias e executar gates.
Nao inclui:
- Migracao total do Brain sem decisao (opcao B).
- Alteracoes em UIs ou produtos fora do escopo.

## Riscos
- R1: Repo Elysian nao acessivel/localizacao divergente.
- R2: Introduzir Python sem quebrar gates Node.
- R3: Evidencias incompletas invalidam a OS.

## Passos (executar 1 por vez)
1) WP0/WP1 Forense no Elysian (somente leitura)
   - Comandos:
     - `cd C:\\Aurora\\Elysian`
     - `git remote -v`
     - `git rev-parse HEAD`
     - `git status -sb`
     - `tree apps\\aurora-brain /f`
     - `tree shared\\proto /f`
     - `Get-ChildItem -Recurse -Filter pyproject.toml | Select-Object FullName`
     - `Get-ChildItem -Recurse -Filter \"aurora_brain.v1.proto\" | Select-Object FullName`
     - `rg -n \"aurora[-_ ]brain|elysian[-_ ]brain|brain|toolbelt|transcribe|whisper|ffmpeg\" .`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum (somente leitura).
   - Criterios de aceite:
     - Forense concluida com paths encontrados.
     - Gates passam.

2) WP1 Entregavel: ELYBI_FORENSICS.md
   - Comandos:
     - `apply_patch` (criar arquivo com status factual e tabela)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ozzmosis/ELYBI_FORENSICS.md`
   - Criterios de aceite:
     - Arquivo criado com status, paths e tabela.
     - Gates passam.

3) WP2 Entregavel: ELYBI_INTEGRATION_PLAN.md
   - Comandos:
     - `apply_patch` (escolha A/B + justificativa + estrutura)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ozzmosis/ELYBI_INTEGRATION_PLAN.md`
   - Criterios de aceite:
     - Opcao escolhida com justificativa e estrutura final.
     - Gates passam.

4) WP3 Criar libs/elysian-brain (ToolBelt STT + CLI + smoke test)
   - Comandos:
     - `apply_patch` (criar estrutura, pyproject, README, toolbelt e tests)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `libs/elysian-brain/pyproject.toml`
     - `libs/elysian-brain/README.md`
     - `libs/elysian-brain/src/elysian_brain/__init__.py`
     - `libs/elysian-brain/src/elysian_brain/toolbelt/__init__.py`
     - `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/__init__.py`
     - `libs/elysian-brain/src/elysian_brain/toolbelt/transcribe/batch_subtitles.py`
     - `libs/elysian-brain/tests/test_smoke_transcribe_cli.py`
   - Criterios de aceite:
     - CLI `elysian-transcribe --help` executavel via poetry script.
     - Smoke test importa o modulo sem erro.
     - Gates passam.

5) WP4 Vault Rodobens (playbook + diretório)
   - Comandos:
     - `apply_patch` (criar playbook + .gitkeep)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/rodobens/TRANSCRIPTION_PLAYBOOK.md`
     - `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/.gitkeep`
   - Criterios de aceite:
     - Arquivos criados conforme OS.
     - Gates passam.

6) WP5 Evidencias + commits
   - Comandos:
     - `apply_patch` (criar ELYBI_EXECUTION_EVIDENCE.md)
     - `scripts/agents/run-gates.ps1`
     - `git add <arquivos>`
     - `git commit -m \"chore(vault): add elysian brain forensics + integration plan + playbook\"`
     - `git commit -m \"chore(toolbelt): add elysian brain stt toolbelt\"`
     - `git push`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ozzmosis/ELYBI_EXECUTION_EVIDENCE.md`
     - arquivos do WP1-WP4
   - Criterios de aceite:
     - Dois commits atomicos com mensagens especificadas.
     - Gates passam.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---

# PLAN — OS-CRMCORE-IMPLEMENT-SPECS-20260101-001 (FastAPI + DB + RBAC)

Objetivo: implementar `apps/crm-core` conforme `docs/specs/*.md` (commit 63d698c) com:
- Modelos SQLAlchemy + migração Alembic (RBAC/Inbox/Pipeline/Audit)
- Routers FastAPI v1 com enforcement RBAC (deny-by-default por teste)
- Auditoria obrigatória em ações sensíveis
- Testes (unit+integration) para RBAC, transições e audit trail

Restrições:
- Sem copiar código third-party
- Endpoints v1 (exceto health) devem declarar permissão explicitamente
- Auditoria obrigatória nos pontos definidos pela OS

## Passos

1) WP1 — Preparação (detectar stack e preparar scaffolding)
   - Mudancas:
     - Confirmar ausência/presença de `pyproject.toml`, `alembic.ini`, `pytest` e app FastAPI.
     - Se ausente, criar scaffolding mínimo compatível com os paths da OS.
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Estrutura e imports definidos de forma determinística

2) WP2 — Modelos + Migração (RBAC/Inbox/Pipeline/Audit)
   - Mudancas (arquivos obrigatórios):
     - `apps/crm-core/src/models/rbac.py`
     - `apps/crm-core/src/models/inbox.py`
     - `apps/crm-core/src/models/pipeline.py`
     - `apps/crm-core/src/models/audit.py`
     - `apps/crm-core/alembic/versions/*_rbac_inbox_pipeline_audit.py`
     - `apps/crm-core/alembic.ini` + `apps/crm-core/alembic/env.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Migração existe e cria tabelas/indices mínimos

3) WP3 — RBAC runtime + audit helper
   - Mudancas:
     - `apps/crm-core/src/security/policy.py` (mapa canônico de permissions)
     - `apps/crm-core/src/security/dependencies.py` (`get_current_subject`, `require_permission` deny-by-default)
     - `apps/crm-core/src/security/audit.py` (`write_audit_log` helper único)
     - Wiring de prova (endpoint protegido mínimo):
       - `apps/crm-core/src/api/v1/health.py`
       - `apps/crm-core/src/api/v1/rbac.py` (GET `/rbac/_probe` exige `PERM_RBAC_ADMIN`)
       - `apps/crm-core/src/main.py` (FastAPI app mínimo + include_router)
     - Teste de enforcement:
       - `apps/crm-core/tests/test_rbac_enforcement.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - `require_permission` nega por default (401/403) e permite bootstrap controlado
     - Helper de auditoria é único e reutilizável por routers
     - Prova A (importabilidade): PASS
     - Prova B (pytest): CI-ENFORCED (Trustware, runner-only) — ver `.github/workflows/ci-crm-core.yml`
       - deps: `apps/crm-core/requirements-test.txt`
       - comando no runner: `cd apps/crm-core && python -m pytest -q`
     - Prova C (gates): CI inclui gate “CI - crm-core (pytest)” como fonte de verdade para WP3
   - Policy:
     - Installs locais continuam proibidos; testes rodam apenas no runner (CI)

### WP3 — Evidence & Checks (Trustware-safe)

- scripts/wp2-wp3_evidences.ps1 (read-only evidence collection; writes to artifacts/wp3/evidence/)
- scripts/wp2-wp3_fix_and_collect.ps1 (read-only checks; writes to artifacts/wp3/checks/)
- apps/crm-core/tests/quarantine/* (legacy artifacts, non-discoverable)

4) WP4 — Routers v1 (RBAC/Inbox/Pipeline/Health)
   - Mudancas:
     - `apps/crm-core/src/api/v1/health.py`
     - `apps/crm-core/src/api/v1/rbac.py`
     - `apps/crm-core/src/api/v1/inbox.py`
     - `apps/crm-core/src/api/v1/pipeline.py`
     - `apps/crm-core/src/main.py` (FastAPI app + include_router)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Endpoints implementados e cada rota v1 (exceto health) declara permissão

5) WP5 — Testes (RBAC deny-by-default + flows + audit)
   - Mudancas:
     - `apps/crm-core/tests/test_rbac_enforcement.py`
     - `apps/crm-core/tests/test_inbox_conversations.py`
     - `apps/crm-core/tests/test_pipeline_state_machine.py`
     - `apps/crm-core/tests/test_audit_trail.py`
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\\agents\\run-gates.ps1`
   - Criterios de aceite:
     - Tests implementados conforme OS; deny-by-default provado via inspeção de rotas

---

# PLAN — OS-CRMCORE-WP4-API-20260101-005 (Inbox + Pipeline endpoints mínimos)
Data: 2026-01-01
Autor: agent
Status: IN PROGRESS

## Objetivo
Expor endpoints REST mínimos de Inbox e Pipeline com RBAC + Audit, mantendo CI como fonte de verdade e sem ampliar escopo.

## Escopo
Inclui:
- Permissões RBAC WP4 em `policy.py` e bootstrap controlado em `dependencies.py`
- Endpoints Inbox e Pipeline v1 com auditoria obrigatória
- Testes pytest (CI runner) para inbox create/read e pipeline state transitions (válida e inválida)
- Nota Chronos OS-CRMCORE-WP4-API-20260101-005
Nao inclui:
- UI, integrações externas, WebSocket/streaming, autenticação externa, multi-tenant avançado

## Riscos
- R1: Bootstrap RBAC permissivo demais; mitigação: liberar apenas permissões listadas em `ALL_PERMISSIONS`.
- R2: Auditoria sem DB real; mitigação: usar sessão stub (duck-typed) apenas para registrar payloads em memória.

## Passos (executar 1 por vez)
1) Ajustar permissões RBAC WP4 + bootstrap controlado
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/crm-core/src/security/policy.py`
     - `apps/crm-core/src/security/dependencies.py`
     - `apps/crm-core/requirements-test.txt`
   - Criterios de aceite:
     - Constantes `inbox:*` e `pipeline:*` compatíveis com WP4
     - Bootstrap permite apenas permissões em `ALL_PERMISSIONS`
     - `requirements-test.txt` inclui `SQLAlchemy` se necessário para importar `audit.py`
     - Gates passam

2) Implementar endpoints Inbox + testes
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/crm-core/src/api/v1/inbox.py`
     - `apps/crm-core/src/main.py`
     - `apps/crm-core/tests/test_inbox_api.py`
   - Criterios de aceite:
     - RBAC `inbox:read`/`inbox:write` aplicado em todas as rotas
     - Auditoria registrada em cada rota
     - Testes cobrem create/read/list (CI runner)
     - Gates passam

3) Commit Inbox
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status`
     - `git add apps/crm-core/src/api/v1/inbox.py apps/crm-core/src/main.py apps/crm-core/tests/test_inbox_api.py apps/crm-core/src/security/policy.py apps/crm-core/src/security/dependencies.py`
     - `git commit -m "feat(crm-core): add inbox endpoints (WP4)"`
     - `git log -1 --oneline`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Commit criado com as mudancas do Inbox
     - Gates passam

4) Implementar endpoints Pipeline + testes
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/crm-core/src/api/v1/pipeline.py`
     - `apps/crm-core/src/main.py`
     - `apps/crm-core/tests/test_pipeline_api.py`
   - Criterios de aceite:
     - RBAC `pipeline:create`/`pipeline:advance`/`pipeline:read` aplicado em todas as rotas
     - Transicoes invalidas retornam 403 + audit
     - Testes cobrem transicao valida e invalida (CI runner)
     - Gates passam

5) Commit Pipeline
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `git status`
     - `git add apps/crm-core/src/api/v1/pipeline.py apps/crm-core/src/main.py apps/crm-core/tests/test_pipeline_api.py`
     - `git commit -m "feat(crm-core): add pipeline endpoints (WP4)"`
     - `git log -1 --oneline`
     - `scripts\agents\run-gates.ps1`
   - Criterios de aceite:
     - Commit criado com as mudancas do Pipeline
     - Gates passam

6) Atualizar PLAN + Chronos
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `PLAN.md`
     - `docs/chronos/OS-CRMCORE-WP4-API-20260101-005.md`
   - Criterios de aceite:
     - Status do WP4 em `PLAN.md` marcado como PASS
     - Nota Chronos criada
     - Gates passam

## Gates
- `scripts\agents\run-gates.ps1`

## Rollback
- `git revert <sha>` para cada commit do WP4
- `scripts\agents\run-gates.ps1`
# PLAN — OS-CODEX-VAULT-ADEMICON-GENESIS-20260102-001
Data: 2026-01-02
Autor: agent

## Objetivo
Materializar o Vault Ademicon como SSOT em disco, criando a estrutura e os arquivos mestres exatamente como especificado na OS, sem criar features.

## Escopo
Inclui:
- Criar a estrutura `apps/ozzmosis/data/vault/ademicon/` com subpastas 00..04.
- Criar os arquivos `.md` e `.json` do Vault com o conteudo fornecido na OS.
- Garantir .gitkeep em `02_MOCKS`.
Nao inclui:
- Criacao de dados mock reais.
- Integracao com Chronos.
- Alteracoes fora do Vault Ademicon.

## Riscos
- R1: Comandos fora do allowlist (git checkout/pull/add/commit/push, run-gates) exigem execucao humana.
- R2: Conteudo divergente do texto fornecido na OS invalida o SSOT.
- R3: Gates nao executados apos passos invalidam o processo do repo.

## Passos (executar 1 por vez)
1) Sincronizar o repo na branch main
   - Comandos:
     - `git checkout main`
     - `git pull --rebase`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum.
   - Criterios de aceite:
     - Branch em `main` e sem conflitos.
     - Gates passam.

2) Criar estrutura do Vault Ademicon e arquivos mestres (conteudo exato da OS)
   - Comandos:
     - `apply_patch` (criar pastas/arquivos e inserir os conteudos exatamente como especificado)
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ademicon/README.md`
     - `apps/ozzmosis/data/vault/ademicon/00_MANIFESTO/DOCTRINE_WEALTH.md`
     - `apps/ozzmosis/data/vault/ademicon/01_STATES/SSOT_STATES.md`
     - `apps/ozzmosis/data/vault/ademicon/02_MOCKS/SCHEMA_DEF.md`
     - `apps/ozzmosis/data/vault/ademicon/02_MOCKS/.gitkeep`
     - `apps/ozzmosis/data/vault/ademicon/03_POLICIES/risk_policy.md`
     - `apps/ozzmosis/data/vault/ademicon/04_DASHBOARD/wireframe_spec.md`
   - Criterios de aceite:
     - Todos os arquivos existem com conteudo idêntico ao especificado.
     - Gates passam.

3) Verificacao rapida (sanity)
   - Comandos:
     - `dir apps/ozzmosis/data/vault/ademicon`
     - `dir apps/ozzmosis/data/vault/ademicon/00_MANIFESTO/DOCTRINE_WEALTH.md`
     - `dir apps/ozzmosis/data/vault/ademicon/01_STATES/SSOT_STATES.md`
     - `dir apps/ozzmosis/data/vault/ademicon/02_MOCKS/SCHEMA_DEF.md`
     - `dir apps/ozzmosis/data/vault/ademicon/03_POLICIES/risk_policy.md`
     - `dir apps/ozzmosis/data/vault/ademicon/04_DASHBOARD/wireframe_spec.md`
     - `scripts/agents/run-gates.ps1`
   - Arquivos:
     - Nenhum (somente verificacao).
   - Criterios de aceite:
     - Todos os arquivos listados aparecem no `dir`.
     - Gates passam.

4) Commit unico do Vault Ademicon
   - Comandos:
     - `git add apps/ozzmosis/data/vault/ademicon`
     - `git status -sb`
     - `git commit -m "chore(vault): genesis Ademicon SSOT vault (wealth doctrine + states + policies)"`
     - `git push`
   - Arquivos:
     - `apps/ozzmosis/data/vault/ademicon/**`
   - Criterios de aceite:
     - `git status -sb` sem pendencias apos commit.
     - Commit unico criado com a mensagem especificada.

## Gates
- `scripts/agents/run-gates.ps1` apos cada passo.

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---
# PLAN — OS-002-RODOBENS-SYNAPSE
Data: 2026-01-06
Autor: agent

## Objetivo
Conectar `apps/mycelium-front` ao `apps/alvaro-core` via REST (FastAPI) para validar
intencao do usuario com Trustware e renderizar warnings/acks no front.

## Escopo
Inclui:
- Implementar Trustware engine e regras YAML em `apps/alvaro-core/services/trustware`.
- Expor endpoint FastAPI `POST /api/v1/trustware/validate`.
- Adicionar client front + componente DecisionGuardian + exemplo no portal Casa.
- Adicionar `.env.example` com `NEXT_PUBLIC_ALVARO_API_BASE_URL`.

Nao inclui:
- Mudancas em auth, banco de dados, ou outras APIs.
- Novas dependencias fora do que ja existe no repo (usar libs ja presentes).
- Refactors fora dos arquivos listados.

## Riscos
- R1: Import path de pacote do backend pode divergir (`apps.alvaro_core`). Mitigacao: ajustar apenas o import mantendo o contrato.
- R2: CORS local pode bloquear o front. Mitigacao: CORS explicito em `apps/alvaro-core/main.py`.
- R3: Fallback do front pode mascarar erro de API. Mitigacao: `is_safe=false` e `note=api_unreachable`.

## Configuracao de ambiente (Front)

### mycelium-front

Variaveis publicas (Next.js):

- `NEXT_PUBLIC_ALVARO_API_BASE_URL` (obrigatoria)
  Base URL do backend `alvaro-core` (sem barra no final).
  Ex: `http://localhost:8000`

- `NEXT_PUBLIC_TRUSTWARE_STRICT` (opcional, default: `true`)
  Politica de falha do Trustware no Front:
  - `true` => fail-closed: API indisponivel bloqueia "continuar"
  - `false` => continua nao pode retornar "seguro"; UI marca degradado e mantem bloqueio por padrao

Trustware Front Policy (canonical):
- O front nunca deve assumir "seguro" por ausencia de resposta.
- Em indisponibilidade do backend: estado degradado explicito (`api_unreachable`) e bloqueio em modo strict (fail-closed).

## Passos (executar 1 por vez)
1) Backend Trustware (engine + rules + rota + CORS)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/alvaro-core/services/trustware/engine.py`
     - `apps/alvaro-core/services/trustware/templates/rodobens_rules.yaml`
     - `apps/alvaro-core/api/routes/trustware.py`
     - `apps/alvaro-core/main.py`
   - Criterios de aceite:
     - `POST /api/v1/trustware/validate` responde JSON com `is_safe`, `warnings`, `required_acks`.
     - CORS permite `http://localhost:3000`.
     - Gates passam.

2) Front Trustware (client + DecisionGuardian + portal Casa)
   - Comandos:
     - `cd C:\Aurora\Ozzmosis`
     - `scripts\agents\run-gates.ps1`
   - Arquivos:
     - `apps/mycelium-front/lib/trustware/client.ts`
     - `apps/mycelium-front/src/components/trustware/DecisionGuardian.tsx`
     - `apps/mycelium-front/src/app/(portals)/casa/page.tsx`
     - `apps/mycelium-front/.env.example`
   - Criterios de aceite:
     - Front chama o backend e renderiza warnings/acks.
     - Fallback retorna `note=api_unreachable` e `is_safe=false`.
     - Gates passam.

## Status
- [x] OS-002 / Step 2 — Front Trustware: client tipado (fail-closed) + DecisionGuardian (acks + mensagens strict/soft) + Portal Casa integrado ao contrato do backend (product_key + user_intent) + `.env.example` com `NEXT_PUBLIC_ALVARO_API_BASE_URL`.

## Gates
- `npm ci`
- `npm run repo:check`

## Rollback
- `git revert <sha>`
- `npm ci && npm run repo:check`

---
