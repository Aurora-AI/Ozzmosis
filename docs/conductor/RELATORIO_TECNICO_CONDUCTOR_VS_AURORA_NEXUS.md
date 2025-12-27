# Relatório Técnico — Aurora Conductor vs Aurora Nexus (pré-integração)

**Data:** 2025-12-27  
**Repo:** Ozzmosis (monorepo Node canônico)  
**Componente:** `libs/aurora-conductor`  
**Objetivo:** consolidar contratos, invariantes, superfícies de integração, riscos e recomendações prescritivas para conectar o Conductor ao **Aurora Nexus** com governança e determinismo.

---

## 1) Resumo executivo técnico

### O que está pronto (base sólida)

- **API pública mínima** já existe e está protegida por “freeze test” (`compose`, `loadContext`, `loadConfig`, `SafeFileSystem`, schemas Zod).
- **Determinismo operacional**: não há uso de rede e não há dependência explícita de clock/UUID; o artifact é derivado apenas de `spec` + textos carregados + template versionado.
- **Side effects por padrão = zero**: `compose()` só escreve em disco quando `writeArtifacts: true`.
- **Hardening básico de filesystem**: `SafeFileSystem` bloqueia path traversal e escrita fora de prefixos permitidos.
- **Policy enforcement real**: quando `aurora.config.json` define `policy.mode=error`, uma violação **aborta** a execução com erro explícito.
- **Survival tests** (blackbox) com **fixtures versionadas** e execução no CI.

### O que falta (para integração Nexus “de verdade”)

- **Execução não-dry-run** ainda não existe (`compose()` lança erro fora de `dryRun=true`).
- **Contrato formal de I/O** para o Nexus ainda precisa ser especificado (request/response schema versionado, níveis de severidade, formato de diagnostics).
- **Observabilidade estruturada**: hoje há `console.warn`; para Nexus é recomendável um logger/telemetria injetável e “structured events”.
- **Trustware extensível**: `checkPolicy()` hoje é um checker simples por tokens; Nexus tende a exigir plugins/regras versionadas e rastreáveis.
- **Blindagem contra symlink escape** não é garantida (Windows/Linux) — o guard atual é por `path.resolve()`/`path.relative()`.

### Risco principal pré-Nexus

O Conductor atual é **correto como “motor determinístico de dry-run + audit artifact”**, mas ainda não é “executor de mudanças” nem “serviço” (não há contratos de streaming, concorrência, cancelamento, nem persistência de estado/telemetria).

---

## 2) Contratos públicos da API (Surface Area)

Fonte: `libs/aurora-conductor/src/index.ts`

### 2.1 Exports obrigatórios (gated por survival T7)

- `compose(spec, opts)` (`ComposeOptions`)
- `loadConfig(repoRoot, opts?)` (`AuroraConfig`, `AuroraConfigSchema`)
- `loadContext(repoRoot, opts?)` (`LoadedContext`)
- `SafeFileSystem` (`SafeFsOptions`)
- `RunArtifactSchema`, `PolicyResultSchema`, `PolicyViolationSchema`

**Garantia:** se um export mínimo sumir/renomear, a suite falha com mensagem “breaking change”.

### 2.2 Semântica operacional (atual)

#### `loadConfig(repoRoot, opts?)`

- Procura `aurora.config.json` (por default; override por `opts.configFileName`).
- Se **não existir**, retorna defaults resilientes e emite `warn`.
- Se existir:
  - JSON inválido → erro com prefixo `aurora.config: JSON inválido ...`
  - Schema inválido → erro com prefixo `aurora.config: schema inválido ...` e **path do campo** (ex.: `policy.mode`)
- Faz validações warn-only para paths de docs (`manualPath`, `constitutionPath`) se apontarem para arquivos inexistentes.

#### `loadContext(repoRoot, opts?)`

- Carrega textos do repo (constituição/manual/product/techstack).
- **Constituição ausente não derruba**: emite `warn` e retorna contexto mínimo (`constitutionText=""`, `sources=[]`).
- Quando `opts.config` fornece `docs.manualPath`/`docs.constitutionPath`, esses paths têm prioridade **se existirem**.
- Docs ausentes são tratadas como **warn-only** (não explode).

#### `compose(spec, opts)`

Pipeline atual:
1. `loadConfig(opts.repoRoot)`
2. `loadContext(opts.repoRoot, { config })`
3. Lê template versionado (`src/templates/plan-template.md`) via `import.meta.url`
4. Renderiza `plan` e executa `checkPolicy({ plan })`
5. Monta `RunArtifact` e valida via `RunArtifactSchema.parse()`
6. Se `policy.mode=error` e há violações → **throw** com mensagem explícita
7. Se `dryRun=true`:
   - se `writeArtifacts=true`: escreve `last-run.json` dentro de `.artifacts/...`
   - sempre retorna o artifact
8. Se `dryRun=false`: erro (“não implementado”)

**Observação crítica:** `compose()` é deterministicamente “puro” por default; os side-effects são opt-in.

---

## 3) Invariantes e Trustware (o que a suite protege)

Referência: `libs/aurora-conductor/tests/survival/` e `libs/aurora-conductor/tests/SURVIVAL_TESTS.md`

### 3.1 Determinismo (sem rede/clock)

Invariantes efetivas:
- Não há chamadas de rede (nenhuma dependência de HTTP/SDK).
- Não há timestamps/UUIDs no `RunArtifact`.
- O template de plano é versionado e lido do pacote (não do repo-alvo).
- Comparação de determinismo em testes normaliza `\r\n` → `\n` para evitar flake por platform newline.

Riscos residuais:
- Ordem de `sources` depende da ordem do código (atual é estável, mas se virar “scan de diretórios” no futuro, deve ser explicitamente ordenado).

### 3.2 Side effects por padrão (zero sujeira)

`compose()` só escreve arquivo quando `writeArtifacts: true`. Isso é fundamental para:
- execução como library em ambiente hostil,
- execução em CI,
- execução pelo Nexus sem “poluir” o repo por acidente.

### 3.3 Policy enforcement (“WARN vs ERROR”)

Referência: `libs/aurora-conductor/src/trustware/policy-checker.ts`

- `checkPolicy()` retorna `{ pass, violations[] }`.
- `compose()` aborta **somente** quando:
  - `policy.pass=false` **e**
  - `aurora.config.json` define `policy.mode="error"`

O abort é explícito e carrega codes/mensagens.

### 3.4 SafeFileSystem (perímetro)

Referência: `libs/aurora-conductor/src/core/file-system.ts`

Proteções:
- `readText()` bloqueia leitura fora do `repoRoot`
- `writeText()` bloqueia:
  - fora do `repoRoot`
  - fora do `scopeDir`
  - fora de `allowedWritePrefixes`

O survival T5 cobre:
- traversal `../`
- paths absolutos
- UNC (Windows)

Limitação conhecida:
- Symlink escape não é garantido (ver seção 6).

---

## 4) Superfícies de integração Conductor ↔ Nexus (design recomendado)

Objetivo do Nexus: tratar o Conductor como **motor determinístico** que produz um artifact auditável, aplicando governança/policy, e opcionalmente escalando para execução real.

### 4.1 Papel recomendado do Conductor no Nexus

- **Library** (processo do Nexus) para ambientes controlados, ou
- **Sidecar/worker** para isolamento (recomendado a médio prazo por segurança e concorrência).

### 4.2 Contrato formal (proposta prescritiva)

Criar schemas versionados (ex.: em `libs/aurora-conductor/src/trustware/schemas.ts` ou módulo dedicado):

- `ComposeRequest`:
  - `version`
  - `repoRoot` (ou `workspaceId` se Nexus abstrair path)
  - `spec`
  - `dryRun`
  - `policyMode` (opcional override; com governança)
  - `contextPack` (ver abaixo)
  - `artifacts` (`write`, `dir`, `mode`)

- `ComposeResponse`:
  - `artifact` (`RunArtifact`)
  - `diagnostics[]` (warnings/errors estruturados)
  - `timings` (opcional e controlado; se existir, deve ser determinístico/omitível)

### 4.3 “Context packs” (para Nexus Router)

Hoje `loadContext()` lê arquivos do repo. Para Nexus, recomenda-se uma camada:
- `ContextPack` = conjunto de fontes (constituição/manual/produto/techstack) já resolvidas pelo Nexus Router,
  - permite multi-repo e roteamento por domínio,
  - remove dependência do filesystem do repo,
  - aumenta determinismo e governança.

Proposta incremental:
1. manter `loadContext(repoRoot)` para compatibilidade local,
2. adicionar `loadContextFromPack(pack)` (novo) e permitir `compose()` aceitar pack opcional.

### 4.4 Concorrência / cancelamento

Para execução em Nexus:
- `compose()` deve aceitar `AbortSignal` (ou equivalente) para cancelamento.
- artifacts devem incluir `runId` determinístico ou fornecido externamente (Nexus define).

---

## 5) Ameaças e mitigação (pré-Nexus)

### 5.1 Path traversal / escape

Coberto:
- traversal relativo, absoluto e UNC (T5).

Não coberto (recomendação):
- symlink escape: criar T8 (future) com fixture que contém symlink apontando para fora do repo e validar bloqueio.

Mitigação recomendada:
- ao ler/escrever, usar `realpath()` e validar novamente `assertInsideRepo` no path resolvido.

### 5.2 Docs ausentes (warn-only)

Risco:
- Nexus pode interpretar “contexto mínimo” como suficiente e produzir planos “cegos”.

Mitigação:
- Nexus deve decidir quando ausência de constituição/manual vira **erro** (governança do produto).
- Alternativa: `aurora.config.json` pode ter `requireConstitution=true` (a definir) para ambientes premium.

### 5.3 Não determinismo futuro

Vetores comuns:
- adicionar timestamps no artifact
- ler arquivos em ordem não-determinística (filesystem order)
- depender de variáveis de ambiente/paths absolutos
- IO fora do temp em testes/CI

Mitigação:
- manter T4 e expandir com “snapshot normalizado” por schema.

### 5.4 Policy enforcement ambíguo

Risco:
- políticas que “passam” mas deveriam bloquear, ou que bloqueiam sem diagnóstico claro.

Mitigação:
- padronizar `PolicyViolation` com `code`, `message`, `severity`, `remediation`.
- reportar violações no artifact mesmo quando abortar (se desejado), mas separar “artifact final” de “failure report”.

---

## 6) Recomendações prescritivas (checklist pré-Nexus)

### 6.1 Checklist (pré-integração)

- [ ] Definir `ComposeRequest/ComposeResponse` schemas versionados.
- [ ] Introduzir logger estruturado (injeção) em `loadConfig/loadContext/compose`.
- [ ] Adicionar suporte a `AbortSignal` em `compose`.
- [ ] Blindar symlink escape (`realpath` + validação).
- [ ] Formalizar “modo governança”: quais inputs ausentes viram erro vs warn.
- [ ] Implementar `non-dryRun` com pipeline de “proposed changes” → “apply changes” usando `SafeFileSystem`.

### 6.2 Onde colocar novos survival tests

- Symlink escape (T8) → `libs/aurora-conductor/tests/survival/`
- Concorrência (T9) → rodar 5–10 `compose()` em paralelo no mesmo repoRoot temp e validar isolamento
- Inputs hostis (T10) → specs gigantes, unicode, null bytes (se aplicável), paths estranhos

---

## 7) Evidências (o que foi validado)

- `npm run survival:conductor` passa localmente e é executado como gate no CI.
- `compose()` não cria `.artifacts` por padrão; escrita é opt-in.
- `policy.mode=error` aborta e não gera `last-run.json` de “sucesso”.

---

## 8) Anexo: arquivos relevantes

- API pública: `libs/aurora-conductor/src/index.ts`
- Pipeline principal: `libs/aurora-conductor/src/core/composer.ts`
- Config: `libs/aurora-conductor/src/core/config-loader.ts`
- Contexto: `libs/aurora-conductor/src/core/context-loader.ts`
- FS guard: `libs/aurora-conductor/src/core/file-system.ts`
- Trustware: `libs/aurora-conductor/src/trustware/policy-checker.ts`
- Schemas: `libs/aurora-conductor/src/trustware/schemas.ts`
- CI: `.github/workflows/ci-conductor.yml`
- Survival suite: `libs/aurora-conductor/tests/survival/`

