# WP-TRUSTWARE-POLICY-EXPANSION-001 — Expanding Decision Coverage

**Status:** CONCLUÍDO
**Data:** 2026-01-14

## OBJETIVO

Expandir a capacidade decisória do Trustware para cobrir mais cenários reais, reduzir ambiguidade e diminuir o uso de `insufficient_data`, sem qualquer alteração de UI, layout ou contratos visuais.

## POLÍTICAS ADICIONADAS/EXPANDIDAS

### Suitability Alpha

#### 1. Multi-Income Aggregation
- **Regra:** Aceita múltiplas fontes de renda com ponderação conservadora
- **Coeficientes:**
  - CLT: 1.0 (renda fixa)
  - Variable: 0.7 (renda variável)
  - Investment: 0.5 (renda de investimentos)
- **Reason Code:** `INCOME_COMPOSITE_APPLIED`

#### 2. Liquidity Depth Check
- **Regra Crítica (BLOCK):** Se `liquidity_months < 3` AND `pmt > 3000` → `blocked`
- **Regra Warn:** Se `liquidity_months < 6` AND `pmt > 2000` → adiciona warning
- **Reason Codes:**
  - `LIQUIDITY_CRITICAL_BLOCK`
  - `LIQUIDITY_SHALLOW_WARN`

#### 3. Tiered Commitment Ratios
Substituiu threshold único (5000) por política escalonada baseada em % da renda:

| Ratio | Estado | Reason Code |
|-------|--------|-------------|
| < 30% | `pass` | — |
| 30-40% | `warn` | `HIGH_COMMITMENT_TIER_2` |
| > 40% | `blocked` | `COMMITMENT_EXCEEDS_SAFE_LIMIT` |

**Fallback:** Se renda não disponível, usa threshold simples de R$ 5000 com code `HIGH_COMMITMENT_NO_INCOME`

### TCO Mirror

#### 1. Semantic Cost Categories
Todos os custos agora possuem categorização semântica interna:
- **certain:** Valores fixos e conhecidos (ex: taxa administrativa)
- **probable:** Baseados em alíquotas determinísticas (ex: ITBI 3%)
- **estimable:** Dependentes de contexto adicional (ex: taxa de transferência por UF)

#### 2. Additional Mandatory Costs
- **Credit Analysis:** R$ 450 (certain)
- **Property Evaluation:** R$ 1200 (certain, condicional se principal > R$ 500k)
- **Transfer Tax:** `null` (declarado como não calculável sem UF)

#### 3. Explicit Non-Computation
- Quando custo não pode ser determinado: `amount: null`, `note: "não calculável sem dados adicionais"`
- Nunca estima cegamente

## CASOS AGORA COBERTOS (ANTES vs. DEPOIS)

### Antes (v2026.01.v1)
- ✅ PMT < 5000 → `pass`
- ✅ PMT > 5000 → `warn`
- ❌ Múltiplas fontes de renda → `insufficient_data`
- ❌ Liquidez crítica → não verificada
- ❌ Comprometimento > 40% → apenas `warn` (deveria bloquear)

### Depois (v2026.01.v2)
- ✅ Multi-income → agregação conservadora
- ✅ Liquidez < 3 meses + PMT alto → `blocked` (proteção financeira)
- ✅ Comprometimento 30-40% → `warn` fundamentado
- ✅ Comprometimento > 40% → `blocked` (barreira de segurança)
- ✅ TCO com custos semânticos claros

## CASOS EXPLICITAMENTE NÃO COBERTOS

Os seguintes cenários **ainda** caem em `insufficient_data` (por design):

1. **Renda não declarada E PMT < 5000:** Não há regra suficiente para decisão definitiva
2. **Liquidez não informada:** Apenas aplica fallback sem análise de profundidade
3. **Transfer Tax sem UF:** Declarado explicitamente como não calculável

**Importante:** `insufficient_data` agora é usado **apenas quando não há regra determinística aplicável**, não por falta de implementação.

## EVIDÊNCIAS DE VALIDAÇÃO

- **Lint:** ✅ PASS
- **Typecheck:** ✅ PASS
- **Build:** ✅ PASS
- **Manual Test (Dev Page):** 3 cenários testados:
  1. Alta renda + boa liquidez → `pass`
  2. Renda moderada + liquidez crítica → `blocked` (LIQUIDITY_CRITICAL_BLOCK)
  3. Alto comprometimento → `warn` ou `blocked` (depende do ratio)

## VALIDAÇÃO FINAL (OBRIGATÓRIA)

> "Essas novas regras reduzem ambiguidade sem introduzir risco ou inferência?"

**SIM.**

**Justificativa:**
1. Todas as regras são **explícitas e documentadas** (thresholds fixos, coeficientes conservadores)
2. Não há **heurística implícita** ou ML
3. Decisões são **reproduzíveis** (mesmo input → mesmo output)
4. `blocked` agora protege cenários de risco real (liquidez crítica, comprometimento > 40%)
5. `insufficient_data` é usado **eticamente** (quando faltam dados para regra determinística)

---

**Arquivos Modificados:**
- [decisions.ts](file:///c:/Aurora/Ozzmosis/apps/genesis-front/src/lib/trustware/decisions.ts)
- [audit/route.ts](file:///c:/Aurora/Ozzmosis/apps/genesis-front/app/api/trustware/audit/route.ts)
- [page.tsx](file:///c:/Aurora/Ozzmosis/apps/genesis-front/app/_dev/trustware-slots/page.tsx)

**Commit:** (pending)

*Assinado: Antigravity Governance Protocol*
