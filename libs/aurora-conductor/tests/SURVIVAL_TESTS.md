# Aurora Conductor — Survival Tests

Objetivo: validar automaticamente que o Conductor continua **útil em ambiente hostil** (repo fake grande, paths estranhos, config ausente/ inválida, policy agressiva, inputs ruins e I/O real), sem depender de rede/clock.

## Como rodar

Na raiz do monorepo:

```bash
npm -w libs/aurora-conductor run test:survival
```

## Regras (survival de verdade)

- Sem rede e sem clock: nenhum teste depende de HTTP/SDKs externos nem de timestamps.
- Sem I/O fora do temp: fixtures são copiadas para um repo temporário e toda escrita acontece dentro desse diretório temporário.
- Sem sujeira no repo real: rodar survival não pode criar `.artifacts` nem arquivos untracked na raiz do Ozzmosis.

## Gate de merge

O CI roda survival como **gate** e executa `npm run survival:conductor` em matriz **Linux + Windows** com repetição anti-flake.

## Estrutura

- Fixtures (repos fake versionados): `libs/aurora-conductor/tests/fixtures/`
- Suite survival (blackbox): `libs/aurora-conductor/tests/survival/`

Cada teste copia uma fixture para um diretório temporário e executa o Conductor apontando `repoRoot` para esse repo fake.

## Invariantes protegidos (T1–T7)

- **T1 — Boot resiliente sem config:** `loadConfig()` e `compose(dryRun)` não podem explodir quando `aurora.config.json` não existe e o repo não tem docs; deve cair em defaults com `warn`.
- **T2 — Erro cirúrgico em config inválida:** `loadConfig()` deve falhar com mensagem que inclua `aurora.config` + o campo inválido (ex.: `policy.mode`).
- **T3 — Docs ausentes = warn-only:** config apontando docs inexistentes não pode derrubar `loadContext()`/`compose()`.
- **T4 — Determinismo:** mesma entrada → mesmo artifact (normalizado), sem dependências de clock/rede.
- **T5 — SafeFileSystem anti-traversal:** leituras/escritas fora do `repoRoot` devem falhar.
- **T6 — Policy ERROR bloqueia:** quando `policy.mode=error` e há violação, `compose()` deve abortar com erro explícito.
- **T7 — Public API freeze:** exports mínimos e schemas críticos não podem sumir sem perceber (breaking change).

## Contrato de artefatos (.artifacts)

Por padrão, `compose()` **não** escreve nada no disco. Para habilitar escrita do artifact do dry-run:

- `compose(spec, { ..., dryRun: true, writeArtifacts: true })`
- opcional: `artifactsDir` (default: `.artifacts/aurora-conductor`) deve iniciar com `.artifacts`

Os survival tests habilitam `writeArtifacts` **apenas** dentro do repo temporário de cada teste.

## Quando quebrar: onde olhar

- Falha em **T1/T2**: `libs/aurora-conductor/src/core/config-loader.ts`
- Falha em **T3**: `libs/aurora-conductor/src/core/context-loader.ts`
- Falha em **T4/T6**: `libs/aurora-conductor/src/core/composer.ts` + `libs/aurora-conductor/src/trustware/policy-checker.ts`
- Falha em **T5**: `libs/aurora-conductor/src/core/file-system.ts`
- Falha em **T7**: `libs/aurora-conductor/src/index.ts`

## Como adicionar cenários

1. Criar uma nova fixture em `libs/aurora-conductor/tests/fixtures/<nome>/`.
2. Adicionar teste novo em `libs/aurora-conductor/tests/survival/conductor.survival.test.ts`.
3. Garantir determinismo (sem rede, sem timestamps não-controlados).
