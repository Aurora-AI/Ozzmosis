# 🧬 OS-GENESIS-TRUSTWARE-VISUAL-HARDENING-CLI-001
**Tipo:** Ordem de Serviço — Execução Técnica (CLI)
**Autor:** ChatGPT — Diretoria Técnica
**Executor:** Agente CLI (Antigravity / CODEX / equivalente)
**Projeto:** Aurora / Ozzmosis
**Produto:** Genesis — Trustware Audit Terminal
**Data:** 2026-01-14
**Status:** 🟢 AUTORIZADA
**SSOT:** Vault

---

## 1. Objetivo (execução real)
Aplicar hardening visual clínico no Trustware Audit Terminal, garantindo:

- UI clinicamente neutra (sem persuasão/marketing)
- estados Trustware consistentes (pass/warn/blocked/insufficient_data)
- leitura rápida (< 2s) e sustentada (uso prolongado)
- acessibilidade mínima (foco/teclado/ARIA essencial)
- observabilidade mínima (data-testid)

**Proibição explícita:** nenhuma lógica Trustware deve ser alterada.

---

## 2. Pré-condições (GATE ZERO)
Antes de tocar em qualquer arquivo, confirmar existência de:

1) Cânone clínico:
```
docs/Vault/FRONTEND/GENESIS_TRUSTWARE_VISUAL_CANON.md
```

2) Visual Freeze macro:
```
docs/Vault/FRONTEND/WP-AG-GRAPH-005.md
```

Se qualquer um estiver ausente → **ABORTAR**.

---

## 3. Escopo e Restrições

### ✅ Permitido
- ajustes de espaçamento interno (padding/gap) e hierarquia visual (sem grid)
- normalização visual dos estados clínicos (sem tokens novos)
- remoção de efeitos persuasivos (glow/neon/anim decorativa)
- foco visível e navegação por teclado
- ARIA essencial em controles não textuais
- `data-testid` em pontos-chave

### ❌ Proibido
- alterar lógica Trustware (toolbelt/policies/thresholds/decisions)
- criar novos slots/estados
- alterar tokens semânticos / paleta base
- alterar tipografia base / grid / layout macro
- introduzir CTA, conversão, linguagem emocional
- alterar copy clínica fora do contrato
- tocar arquivos fora da allowlist

---

## 4. Allowlist absoluta de arquivos
O executor **SÓ PODE** modificar os arquivos abaixo:

```
apps/genesis-front/components/terminal/TrustwareAuditTerminal.tsx
apps/genesis-front/components/terminal/AuditSideRail.tsx
apps/genesis-front/components/trustware/TrustwareStateFrame.tsx
apps/genesis-front/components/trustware/TrustwareStateBadge.tsx
apps/genesis-front/components/templates/slots/TrustwareSlotRenderer.tsx
```

Se outro arquivo aparecer no diff → **ABORTAR**.

---

## 5. Tarefas de Execução (passo a passo)

### 5.1 Remover anti-padrões visuais (persuasivos)
Garantir que não existam (neste escopo):
- glow / neon / “brilho emocional”
- animação decorativa
- transições longas (> 200ms) sem função cognitiva
- feedback “celebratório” em `pass` (sem “parabéns” visual)

### 5.2 Hardening de estados clínicos (semântica lógica)
Garantir tratamento consistente:

- `pass`: discreto, não celebratório
- `warn`: atenção silenciosa (não alarmista)
- `blocked`: bloqueio claro (sem dramatização)
- `insufficient_data`: ausência ética explícita e neutra (não “erro de sistema”)

**Regra:** cor = estado lógico, não emoção.

### 5.3 Hierarquia e densidade (uso prolongado)
Ajustes permitidos:
- reduzir/normalizar `gap` e `padding` internos em blocos secundários
- melhorar scan do summary/título/estado
- reduzir competição visual entre elementos
- preservar leitura em < 2s com 3–5 slots

**Proibição:** não mexer em grid/layout macro.

### 5.4 Acessibilidade mínima (A11y)
Aplicar:
- foco visível e discreto nos elementos interativos principais
- navegação por teclado (Tab/Enter/Space) onde fizer sentido
- `aria-label` em controles não textuais
- `role="status"` apenas quando necessário (badges/mensagens)

**Nota:** não implementar focus-trap complexo.

### 5.5 Observabilidade mínima
Adicionar `data-testid` estáveis em:
- terminal root
- side rail root + itens principais
- slot renderer
- badge/frame de estado

---

## 6. Gates obrigatórios
Executar todos e exigir PASS:

```bash
npm -w @aurora/genesis-front run lint
npm -w @aurora/genesis-front run typecheck
npm -w @aurora/genesis-front run build
```

Falha em qualquer um → **ABORTAR** e não commitar.

---

## 7. Evidências obrigatórias

Antes do commit:

```bash
git diff --cached --name-only
```

Depois do commit:

```bash
git show --name-only --oneline --no-patch HEAD
```

---

## 8. Commit (1 OS = 1 commit)

Mensagem canônica:

```text
feat(frontend): clinical visual hardening for trustware terminal (OS-GENESIS-TRUSTWARE-VISUAL-HARDENING-CLI-001)
```

---

## 9. Vault Close (obrigatório)

Criar:

`docs/Vault/FRONTEND/OS-GENESIS-TRUSTWARE-VISUAL-HARDENING-CLI-001_CLOSE.md`

Conteúdo mínimo:

* objetivo
* arquivos alterados (confirmar allowlist)
* gates (PASS)
* hash do commit
* declaração explícita: “Nenhuma lógica Trustware foi alterada.”

---

## 10. Definition of Done (DOD)

Concluída apenas se:

* UI clinicamente neutra (sem persuasão)
* estados consistentes (pass/warn/blocked/insufficient_data)
* foco/teclado/ARIA mínimos funcionando
* `data-testid` presentes
* gates PASS
* 1 commit
* Vault Close criado
