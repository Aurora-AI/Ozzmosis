# WP-TRUSTWARE-INTEGRATION-001 — Wiring Real Decisions (Toolbelt → Slots)

**Status:** CONCLUÍDO
**Data:** 2026-01-14

## OBJETIVO
Conectar os Trustware Slots a decisões reais e determinísticas provenientes do Toolbelt, substituindo payloads dummy por outputs auditáveis e semanticamente estáveis.

## ARQUIVOS CRIADOS/MODIFICADOS
- `apps/genesis-front/src/lib/trustware/decisions.ts`: Camada de orquestração server-side.
- `apps/genesis-front/app/api/trustware/audit/route.ts`: API Route de auditoria viva.
- `apps/genesis-front/components/templates/slots/SuitabilityAlphaSlot.tsx`: Adaptação para payloads reais.
- `apps/genesis-front/components/templates/slots/TCOMirrorSlot.tsx`: Adaptação para payloads reais.
- `apps/genesis-front/app/_dev/trustware-slots/page.tsx`: Upgrade para Live Audit (Server-side).

## FONTE DAS DECISÕES
As decisões são orquestradas via Toolbelt (`libs/elysian-brain`):
- **Suitability Alpha:** Baseado na ferramenta `finance` (op: `pmt`). Calcula comprometimento mensal e aplica regras determinísticas de integridade.
- **TCO Mirror:** Projeção determinística de custos acessórios (ITBI, Registro, Escritura) baseada em alíquotas fixas e auditáveis.

## COMPORTAMENTO EM DADOS INSUFICIENTES
Caso o motor de cálculo (Toolbelt) retorne erro ou ausência de conexão, o slot assume o estado ético **`insufficient_data`**, declarando explicitamente em `missing_fields` a falha de conexão ou dados. Jamais há inferência comercial ou "best-guess".

## EVIDÊNCIA DE VALIDAÇÃO
- **Lint**: ✅ PASS
- **Typecheck**: ✅ PASS
- **Build**: ✅ PASS
- **Live Test (Dev Page)**: Slots renderizam dados provenientes do `runToolbeltSync`.

## VALIDAÇÃO FINAL (HUMANA)

> “Dado o mesmo input, este sistema sempre produzirá a mesma decisão?”

**SIM.** O fluxo Toolbelt -> CLI -> Orchestrator -> Slot é puramente funcional e determinístico.

---
**Commit:** `54886fc`

*Assinado: Antigravity Governance Protocol*
