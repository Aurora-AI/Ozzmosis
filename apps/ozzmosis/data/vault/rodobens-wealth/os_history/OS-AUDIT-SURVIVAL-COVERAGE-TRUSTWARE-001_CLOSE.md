# OS-AUDIT-SURVIVAL-COVERAGE-TRUSTWARE-001 — FECHAMENTO

**Data:** 09/01/2026  
**Executor:** GitHub Copilot  
**Branch:** chore/os-shield-green-001  

---

## Objetivo

Evoluir `scripts/audit/survival_check.py` para cobrir **automaticamente** workspaces que possuem `scripts.test:survival`, sem lista fixa de componentes, e gerar evidência determinística no `artifacts/survival_check.json`.

---

## Decisão Técnica Aprovada

✅ **Descoberta genérica**: Auditor agora descobre workspaces via:
1. Leitura do campo `workspaces` em `package.json` (raiz)
2. Resolução de padrões glob (`apps/*`, `libs/*`, `packages/*`)
3. Filtragem por presença de `scripts.test:survival`

✅ **Sem hardcode**: Lista estática removida; componentes descobertos dinamicamente.

✅ **Compatibilidade**: Output mantém chaves globais (`ok`, `failed_count`, `results[]`).

---

## Commit Realizado

**Hash:** `03c30bc`  
**Mensagem:** `chore(audit): discover survival workspaces by test:survival script`  
**Arquivos alterados:**
- `scripts/audit/survival_check.py` (+93 linhas, -40 linhas)

**Mudanças principais:**
- Adicionada função `_discover_survival_workspaces()`: resolve workspaces a partir do package.json raiz
- Refatorada `_check_component()`: validação genérica (sem cases hardcoded)
- Refatorada `main()`: usa descoberta genérica em vez de lista estática
- Melhorada robustez: tratamento de OSError/PermissionError em `_find_survival_files()` (symlinks no Windows)

---

## Evidência SSOT

### Teste Local: `npm run audit:maturity`

**Resultado:** ✅ Sucesso

```json
{
  "ok": true,
  "failed_count": 0,
  "results": [
    ...
    {
      "key": "trustware",
      "path": "libs/trustware",
      "kind": "node",
      "status": "ok",
      "reason_codes": [],
      "evidence": [
        {
          "kind": "script",
          "path": "libs\\trustware\\package.json",
          "note": "test:survival"
        },
        {
          "kind": "run",
          "path": "libs\\trustware\\package.json",
          "note": "test:survival_exit_code=0"
        },
        {
          "kind": "file",
          "path": "tests\\survival\\engine.survival.test.ts",
          "note": "survival_file"
        },
        {
          "kind": "workflow",
          "path": ".github\\workflows\\ci-survival-trustware.yml",
          "note": "workflow_contains_survival"
        }
      ],
      "run": {
        "command": "C:\\Program Files\\nodejs\\npm.cmd run -w @aurora/trustware test:survival",
        "exit_code": 0,
        "stdout": "...✓ tests/survival/engine.survival.test.ts (3 tests) 4ms\n Test Files 1 passed (1)\n Tests 3 passed (3)...",
        "stderr": ""
      }
    }
  ]
}
```

---

## Resultado Esperado vs. Observado

| Critério | Esperado | Observado | Status |
|----------|----------|-----------|--------|
| Trustware entra no SSOT | Sim | ✅ Sim (key="trustware", status="ok") | ✓ OK |
| reason_codes limpo | [] | ✅ [] | ✓ OK |
| failed_count global | 0 | ✅ 0 | ✓ OK |
| Testes survival trustware | 3/3 pass | ✅ 3/3 pass (exit_code=0) | ✓ OK |
| Descoberta genérica | Workspace-based | ✅ Por `test:survival` | ✓ OK |
| Sem hardcode | Todos os casos genéricos | ✅ Removidos cases específicos | ✓ OK |

---

## Workspaces Descobertos (Auditoria)

Total: 6 workspaces com `test:survival`

1. **aurora-chronos** (`libs/aurora-chronos`) → status: ok ✓
2. **crm-core** (`apps/crm-core`) → status: ok ✓
3. **alvaro-core** (`apps/alvaro-core`) → status: ok ✓
4. **butantan-shield** (`apps/butantan-shield`) → status: ok ✓
5. **trustware** (`libs/trustware`) → status: ok ✓ **(NOVO)**
6. **aurora-conductor-service** (`apps/aurora-conductor-service`) → status: ok ✓

---

## Próximos Passos Recomendados

1. **Integração mínima** (Alvaro ↔ TrustwareEngine): albaro-core pode consumir `@aurora/trustware` engine publicamente
2. **Packaging/Build**: Preparar `trustware` para publicação (dist, types)
3. **Cobertura de mais workspaces**: Se novos workspaces adicionarem `test:survival`, entram automaticamente no SSOT

---

## Governança

✅ **Escopo respeitado:** Apenas `scripts/audit/survival_check.py` alterado  
✅ **Commit atômico:** Uma mudança, uma causa raiz  
✅ **Não quebrabreaking:** Saída JSON compatível com consumidores existentes  
✅ **Determinístico:** Sem rede, sem LLM, sem I/O não-determinístico  
✅ **Auditável:** Estratégia explícita na função `_discover_survival_workspaces()`

---

## Assinatura

- **OS:** OS-AUDIT-SURVIVAL-COVERAGE-TRUSTWARE-001
- **Conclusão:** ✅ COMPLETA
- **Push:** 09/01/2026 20:00 UTC
- **Branch:** chore/os-shield-green-001 (commit 03c30bc)
