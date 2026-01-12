# CLOSE ADDENDUM — OS-GOV-AGENTS-CONTEXT-FOUNDATION-20260112-001

**Data:** 2026-01-12
**Motivo:** Correção de desvios materiais (OS-FIX-...-001A)
**SSOT:** `docs/Vault/CONSTITUICAO_AURORA.md`

---

## O que foi corrigido

- WP1: Mycelium reclassificação correta (manual derivado + alias deprecated no arquivo correto).
- WP2: README_COPILOT local revogado (alias para guia canônico).
- WP3: Decisão canônica genérica "LLM local; sem cloud fallback" criada.
- WP4: Runner canônico Linux criado/garantido.
- Fechamento no Vault do projeto consolidado neste adendo.

---

## Evidência (gates)

- Windows gates: best-effort (podem falhar por EPERM/locks).
- Gates canônicos: executar `scripts/agents/run-gates-linux.ps1` e anexar o output abaixo.

### Output (colar após execução)

```text
PS C:\Aurora\Ozzmosis> .\scripts\agents\run-gates-linux.ps1
== Gates (Linux container): repo-root = C:\Aurora\Ozzmosis ==
debconf: delaying package configuration, since apt-utils is not installed
== npm ci ==
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a 
good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported

added 923 packages, and audited 935 packages in 6m

219 packages are looking for funding
	run `npm fund` for details

found 0 vulnerabilities
npm notice
npm notice New major version of npm available! 10.8.2 -> 11.7.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.7.0
npm notice To update run: npm install -g npm@11.7.0
npm notice
== repo:check ==

> @aurora/tooling@0.1.0 repo:check
> node ./scripts/check-repo-contract.mjs

[repo-contract] OK
== audit: entrypoints_check ==
== audit: survival_check ==
== done ==
-rwxrwxrwx 1 root root  5410 Jan 12 18:23 artifacts/entrypoints_check.json
-rwxrwxrwx 1 root root 12057 Jan 12 18:26 artifacts/survival_check.json
== Gates (Linux container): PASS ==
```
