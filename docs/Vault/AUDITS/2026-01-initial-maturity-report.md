# Product Maturity Report (Ozzmosis)
- generated_at_utc: `2026-01-06T212332Z`

## Summary

| component | kind | foundation | core | contract | survival | integration | internal_prod | external_prod |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `alvaro-core` | app | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 | 🟡 | 🟡 |
| `aurora-conductor-service` | app | 🟢 | 🟢 | 🔴 | 🔴 | 🟡 | 🟡 | 🟡 |
| `butantan-shield` | app | 🟢 | 🟢 | 🔴 | 🟢 | 🟡 | 🟡 | 🟡 |
| `chronos-backoffice` | app | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 | 🟡 | 🟡 |
| `crm-core` | app | 🟡 | 🔴 | 🟡 | 🟢 | 🟡 | 🟡 | 🟡 |
| `genesis-front` | app | 🟢 | 🟢 | 🔴 | 🔴 | 🟡 | 🔴 | 🟡 |
| `mycelium-front` | app | 🟢 | 🟢 | 🟡 | 🟡 | 🟡 | 🔴 | 🟡 |
| `ozzmosis` | app | 🟡 | 🔴 | 🔴 | 🔴 | 🟡 | 🔴 | 🔴 |
| `aurora-chronos` | lib | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 | 🔴 | 🟡 |
| `aurora-conductor` | lib | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 | 🔴 | 🟡 |
| `elysian-brain` | lib | 🟢 | 🔴 | 🔴 | 🟡 | 🟡 | 🔴 | 🔴 |
| `trustware` | lib | 🟢 | 🔴 | 🟡 | 🟢 | 🟡 | 🔴 | 🟡 |
| `tooling` | package | 🟢 | 🟢 | 🔴 | 🔴 | 🟡 | 🔴 | 🟡 |
| `tsconfig` | package | 🟢 | 🔴 | 🔴 | 🔴 | 🟡 | 🔴 | 🟡 |

## Evidence (selected)

### alvaro-core (app)
- path: `apps\alvaro-core`
- foundation: `green`
  - `apps\alvaro-core\README.md` — readme_present
  - `apps\alvaro-core\readme.md` — readme_present
  - `apps\alvaro-core\pyproject.toml` — pyproject
- core_functional: `green`
  - `apps\alvaro-core\main.py` — python_entrypoint
  - `apps\alvaro-core\main.py` — fastapi_detected
- stable_contract: `yellow`
  - `apps\alvaro-core\main.py` — fastapi_detected
- survival_tests: `green`
  - `apps\alvaro-core\tests\survival` — survival_test_file
  - `apps\alvaro-core\tests\survival\test_survival_trustware.py` — survival_test_file
  - `.github\workflows\ci-survival-alvaro-core.yml` — survival_workflow
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-survival-alvaro-core.yml` — workflow_mentions_component
  - `docs\CONTRACT.md` — docs_mention
- internal_production_ready: `yellow`
  - `apps\alvaro-core\main.py` — health_endpoint_hint
- external_product_ready: `yellow`
  - `.github\workflows\ci-survival-alvaro-core.yml` — workflow_mentions_component

### aurora-conductor-service (app)
- path: `apps\aurora-conductor-service`
- foundation: `green`
  - `apps\aurora-conductor-service\docs` — docs_present
  - `apps\aurora-conductor-service\package.json` — package_json
- core_functional: `green`
  - `apps\aurora-conductor-service\package.json` — npm_scripts_present
- stable_contract: `red`
  - (no evidence)
- survival_tests: `red`
  - (no evidence)
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component
- internal_production_ready: `yellow`
  - `apps\aurora-conductor-service\Dockerfile` — container_artifact
- external_product_ready: `yellow`
  - `apps\aurora-conductor-service\package.json` — version_present
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component

### butantan-shield (app)
- path: `apps\butantan-shield`
- foundation: `green`
  - `apps\butantan-shield\docs` — docs_present
  - `apps\butantan-shield\package.json` — package_json
- core_functional: `green`
  - `apps\butantan-shield\package.json` — npm_scripts_present
- stable_contract: `red`
  - (no evidence)
- survival_tests: `green`
  - `apps\butantan-shield\package.json` — survival_script_present
  - `apps\butantan-shield\tests\survival` — survival_test_file
  - `apps\butantan-shield\tests\survival\shield.survival.test.ts` — survival_test_file
  - `.github\workflows\ci-survival-shield.yml` — survival_workflow
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-smoke-shield.yml` — workflow_mentions_component
  - `.github\workflows\ci-survival-shield.yml` — workflow_mentions_component
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component
  - `docs\CONTRACT.md` — docs_mention
- internal_production_ready: `yellow`
  - `apps\butantan-shield\Dockerfile` — container_artifact
- external_product_ready: `yellow`
  - `apps\butantan-shield\package.json` — version_present
  - `.github\workflows\ci-smoke-shield.yml` — workflow_mentions_component
  - `.github\workflows\ci-survival-shield.yml` — workflow_mentions_component
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component

### chronos-backoffice (app)
- path: `apps\chronos-backoffice`
- foundation: `green`
  - `apps\chronos-backoffice\package.json` — package_json
- core_functional: `green`
  - `apps\chronos-backoffice\package.json` — npm_scripts_present
- stable_contract: `yellow`
  - `apps\chronos-backoffice\src\app\api` — next_api_routes_present
- survival_tests: `green`
  - `apps\chronos-backoffice\package.json` — survival_script_present
  - `.github\workflows\ci-chronos.yml` — survival_workflow
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-chronos.yml` — workflow_mentions_component
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component
  - `docs\chronos\CHRONOS_DISCOVERY_REPORT.md` — docs_mention
- internal_production_ready: `yellow`
  - `apps\chronos-backoffice\Dockerfile` — container_artifact
- external_product_ready: `yellow`
  - `apps\chronos-backoffice\package.json` — version_present
  - `.github\workflows\ci-chronos.yml` — workflow_mentions_component
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component

### crm-core (app)
- path: `apps\crm-core`
- foundation: `yellow`
  - (no evidence)
- core_functional: `red`
  - (no evidence)
- stable_contract: `yellow`
  - `apps\crm-core\src\main.py` — fastapi_detected
- survival_tests: `green`
  - `apps\crm-core\tests\survival` — survival_test_file
  - `apps\crm-core\tests\survival\test_survival_policy.py` — survival_test_file
  - `.github\workflows\ci-repo-contract.yml` — survival_workflow
  - `.github\workflows\ci-survival-crm-core.yml` — survival_workflow
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-crm-core.yml` — workflow_mentions_component
  - `.github\workflows\ci-repo-contract.yml` — workflow_mentions_component
  - `.github\workflows\ci-survival-crm-core.yml` — workflow_mentions_component
  - `docs\AUDITS\CRM_COMPLETENESS_REPORT.md` — docs_mention
- internal_production_ready: `yellow`
  - `apps\crm-core\src\api\v1\health.py` — health_endpoint_hint
- external_product_ready: `yellow`
  - `.github\workflows\ci-crm-core.yml` — workflow_mentions_component
  - `.github\workflows\ci-repo-contract.yml` — workflow_mentions_component
  - `.github\workflows\ci-survival-crm-core.yml` — workflow_mentions_component

### genesis-front (app)
- path: `apps\genesis-front`
- foundation: `green`
  - `apps\genesis-front\package.json` — package_json
- core_functional: `green`
  - `apps\genesis-front\package.json` — npm_scripts_present
- stable_contract: `red`
  - (no evidence)
- survival_tests: `red`
  - (no evidence)
- ecosystem_integration: `yellow`
  - `docs\os\OS-ANTIGRAVITY-GENESIS-FANTASY-TRANSLATION-003.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `yellow`
  - `apps\genesis-front\package.json` — version_present

### mycelium-front (app)
- path: `apps\mycelium-front`
- foundation: `green`
  - `apps\mycelium-front\README.md` — readme_present
  - `apps\mycelium-front\readme.md` — readme_present
  - `apps\mycelium-front\docs` — docs_present
  - `apps\mycelium-front\package.json` — package_json
- core_functional: `green`
  - `apps\mycelium-front\package.json` — npm_scripts_present
- stable_contract: `yellow`
  - `apps\mycelium-front\app\api` — next_api_routes_present
- survival_tests: `yellow`
  - `apps\mycelium-front\tests` — tests_folder_present
  - `apps\mycelium-front\__tests__` — tests_folder_present
  - `apps\mycelium-front\tests\contract\metrics.contract.test.ts` — test_file
  - `apps\mycelium-front\tests\integration\api.data.integration.test.ts` — test_file
  - `apps\mycelium-front\tests\integration\api.metrics.integration.test.ts` — test_file
  - `apps\mycelium-front\tests\unit\compute.test.ts` — test_file
  - `apps\mycelium-front\tests\unit\normalize.test.ts` — test_file
  - `apps\mycelium-front\tests\unit\time.test.ts` — test_file
  - `apps\mycelium-front\__tests__\api-routes.test.ts` — test_file
  - `apps\mycelium-front\__tests__\publisher.test.ts` — test_file
  - `apps\mycelium-front\tests\integration\cover.render.test.tsx` — test_file
  - `apps\mycelium-front\tests\integration\dashboard.render.test.tsx` — test_file
- ecosystem_integration: `yellow`
  - `docs\CONTRACT.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `yellow`
  - `apps\mycelium-front\package.json` — version_present

### ozzmosis (app)
- path: `apps\ozzmosis`
- foundation: `yellow`
  - (no evidence)
- core_functional: `red`
  - (no evidence)
- stable_contract: `red`
  - (no evidence)
- survival_tests: `red`
  - (no evidence)
- ecosystem_integration: `yellow`
  - `docs\Vault_SSoT_MANIFEST.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `red`
  - (no evidence)

### aurora-chronos (lib)
- path: `libs\aurora-chronos`
- foundation: `green`
  - `libs\aurora-chronos\README.md` — readme_present
  - `libs\aurora-chronos\readme.md` — readme_present
  - `libs\aurora-chronos\package.json` — package_json
- core_functional: `green`
  - `libs\aurora-chronos\package.json` — npm_scripts_present
- stable_contract: `yellow`
  - `libs\aurora-chronos\package.json` — node_exports_or_main
- survival_tests: `green`
  - `libs\aurora-chronos\package.json` — survival_script_present
  - `libs\aurora-chronos\tests\survival` — survival_test_file
  - `libs\aurora-chronos\tests\survival\chronos.survival.test.ts` — survival_test_file
  - `.github\workflows\ci-survival-chronos.yml` — survival_workflow
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-survival-chronos.yml` — workflow_mentions_component
  - `docs\CONTRACT.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `yellow`
  - `libs\aurora-chronos\package.json` — version_present
  - `.github\workflows\ci-survival-chronos.yml` — workflow_mentions_component

### aurora-conductor (lib)
- path: `libs\aurora-conductor`
- foundation: `green`
  - `libs\aurora-conductor\README.md` — readme_present
  - `libs\aurora-conductor\readme.md` — readme_present
  - `libs\aurora-conductor\docs` — docs_present
  - `libs\aurora-conductor\package.json` — package_json
- core_functional: `green`
  - `libs\aurora-conductor\package.json` — npm_scripts_present
- stable_contract: `yellow`
  - `libs\aurora-conductor\package.json` — node_exports_or_main
- survival_tests: `green`
  - `libs\aurora-conductor\package.json` — survival_script_present
  - `libs\aurora-conductor\tests\survival` — survival_test_file
  - `libs\aurora-conductor\tests\SURVIVAL_TESTS.md` — survival_test_file
  - `libs\aurora-conductor\tests\survival\conductor.survival.test.ts` — survival_test_file
  - `.github\workflows\ci-conductor.yml` — survival_workflow
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-conductor.yml` — workflow_mentions_component
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component
  - `docs\CONTRACT.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `yellow`
  - `libs\aurora-conductor\package.json` — version_present
  - `.github\workflows\ci-conductor.yml` — workflow_mentions_component
  - `.github\workflows\ci-triad-smoke.yml` — workflow_mentions_component

### elysian-brain (lib)
- path: `libs\elysian-brain`
- foundation: `green`
  - `libs\elysian-brain\README.md` — readme_present
  - `libs\elysian-brain\readme.md` — readme_present
  - `libs\elysian-brain\pyproject.toml` — pyproject
- core_functional: `red`
  - (no evidence)
- stable_contract: `red`
  - (no evidence)
- survival_tests: `yellow`
  - `libs\elysian-brain\tests` — tests_folder_present
  - `libs\elysian-brain\tests\test_smoke_transcribe_cli.py` — test_file
- ecosystem_integration: `yellow`
  - `docs\elysian\TOOLBELT_TAXONOMY.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `red`
  - (no evidence)

### trustware (lib)
- path: `libs\trustware`
- foundation: `green`
  - `libs\trustware\package.json` — package_json
- core_functional: `red`
  - (no evidence)
- stable_contract: `yellow`
  - `libs\trustware\package.json` — node_exports_or_main
- survival_tests: `green`
  - `.github\workflows\ci-chronos.yml` — survival_workflow
- ecosystem_integration: `yellow`
  - `.github\workflows\ci-chronos.yml` — workflow_mentions_component
  - `docs\chronos\CHRONOS_DISCOVERY_REPORT.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `yellow`
  - `libs\trustware\package.json` — version_present
  - `.github\workflows\ci-chronos.yml` — workflow_mentions_component

### tooling (package)
- path: `packages\tooling`
- foundation: `green`
  - `packages\tooling\package.json` — package_json
- core_functional: `green`
  - `packages\tooling\package.json` — npm_scripts_present
- stable_contract: `red`
  - (no evidence)
- survival_tests: `red`
  - (no evidence)
- ecosystem_integration: `yellow`
  - `docs\CONTRACT.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `yellow`
  - `packages\tooling\package.json` — version_present

### tsconfig (package)
- path: `packages\tsconfig`
- foundation: `green`
  - `packages\tsconfig\package.json` — package_json
- core_functional: `red`
  - (no evidence)
- stable_contract: `red`
  - (no evidence)
- survival_tests: `red`
  - (no evidence)
- ecosystem_integration: `yellow`
  - `docs\CONTRACT.md` — docs_mention
- internal_production_ready: `red`
  - (no evidence)
- external_product_ready: `yellow`
  - `packages\tsconfig\package.json` — version_present
