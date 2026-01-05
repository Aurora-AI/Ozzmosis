# OS-ANTIGRAVITY-GENESIS-REBUILD-004 — Atmospheric Front, Source-of-Truth

**Status:** ABERTA (EXECUCAO IMEDIATA)
**Alvo:** apps/genesis-front
**Doutrina:** "O usuario nao preenche formularios. Ele constroi decisoes." | Fonte versionada > Build
**Data:** 2026-01-04

---

## Objetivo

Reconstruir do zero o `apps/genesis-front` com fonte versionada (SSOT em disco), preservando:

- Light Mode de impacto (Absolute White + Black Piano)
- Deep Scroll (Lenis)
- Transicoes atmosfericas (framer-motion)
- Golden Path: Hero -> LifeMap -> Proposals -> Acceptance

---

## Regras (nao-negociaveis)

- Fonte versionada > build/cache. Proibido concluir OS sem `package.json` + `app/` (ou `src/`) + `components/`.
- Light mode only nesta fase.
- Mocks sao permitidos somente para DEV; nao sao deliverable.
- Nao alterar backend; se CORS bloquear local, resolver no front via proxy/rewrite DEV-only.

---

## Entregaveis obrigatorios (criterio de aceite)

1) `apps/genesis-front/package.json` presente e funcional (workspace npm).
2) `apps/genesis-front/app/**` (Next App Router) com estados/paginas reais.
3) `apps/genesis-front/components/**` com componentes atmosfericos.
4) `apps/genesis-front/lib/api.ts` consumindo `NEXT_PUBLIC_API_URL`.
5) `.gitignore` garantindo que `.next/`, `node_modules/`, `.env.local` nunca sejam commitados.
6) Este documento com:
   - lista de arquivos criados/modificados
   - "como rodar"
7) Build e typecheck passando:
   - `npm -w apps/genesis-front run build`
   - `npm -w apps/genesis-front run typecheck`
   - `scripts/agents/run-gates.ps1`
8) Commit pequeno e descritivo com trailer obrigatorio:
   - `OS: OS-ANTIGRAVITY-GENESIS-REBUILD-004`

---

## Work Packages

### WP1 — Genesis limpo (sem fantasma)

- Se `apps/genesis-front` existir apenas com artefatos: apagar e recriar.
- Criar app Next (mesma versao adotada no monorepo).
- Garantir que sobe com `npm -w apps/genesis-front run dev`.

### WP2 — Tokens "Impact Light"

- Fundo: `#FFFFFF`
- Texto/bordas principais: `#050505` (Black Piano)
- Espaco negativo forte, bordas finas, tipografia com peso.
- Proibido dark-mode nesta fase.

### WP3 — Deep Scroll + estados

- Lenis ativo globalmente (single-screen illusion).
- framer-motion para transicoes de opacidade/escala por estado.
- Estados no scroll:
  1. Hero (100vh)
  2. Decision Space (tiles)
  3. LifeMap (sliders)
  4. Proposals
  5. Acceptance

### WP4 — Data handshake real (sem CORS travando a entrega)

- Consumo de API via `NEXT_PUBLIC_API_URL`.
- Se CORS bloquear local:
  - solucao de front (proxy / rewrites no Next) para DEV
  - sem mudar backend (congelado)

### WP5 — Gates + evidencia + commit

- Rodar gates do repo.
- Atualizar este doc com lista de arquivos e "como rodar".
- Preparar mensagem de commit com trailer obrigatorio (sem push antes de gates PASS).

---

## Como rodar (dev)

1) Instalar dependencias do monorepo:
   - `cd C:\Aurora\Ozzmosis`
   - `npm ci`

2) Subir o front:
   - `npm -w apps/genesis-front run dev`

3) Build/typecheck:
   - `npm -w apps/genesis-front run build`
   - `npm -w apps/genesis-front run typecheck`

---

## Prompt (Agent)

```
Execute OS-ANTIGRAVITY-GENESIS-REBUILD-004.

Context:
- OS-003 had its source code reverted/lost. Only .next and node_modules remained.
- We must rebuild apps/genesis-front with source-of-truth on disk.
- Light mode only. Absolute white background (#FFFFFF) and Black Piano elements (#050505).
- Deliverable requires package.json + app/ or src/ + components/ + lib/api.ts + .gitignore hardening.
- Use Lenis for deep scroll and framer-motion for atmospheric state transitions.
- Implement Next rewrites/proxy if needed to avoid CORS during local dev, without changing backend.

Do NOT claim completion unless all deliverables exist on disk.
At the end:
- output the list of created/modified files
- run build/typecheck
- prepare a commit message with trailer:
  OS: OS-ANTIGRAVITY-GENESIS-REBUILD-004
```

