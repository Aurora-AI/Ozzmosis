import React from "react";
import { SuitabilityAlphaSlot } from "../../../components/templates/slots/SuitabilityAlphaSlot";
import { TCOMirrorSlot } from "../../../components/templates/slots/TCOMirrorSlot";
import { getSuitabilityDecision, getTCODecision } from "../../../src/lib/trustware/decisions";

export const metadata = {
  title: "Dev — Trustware Slots Expanded Policies"
};

/**
 * Dev Page - Testanto políticas expandidas com múltiplos cenários
 */
export default async function TrustwareSlotsLivePage() {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-base font-semibold text-foreground">Indisponível</h1>
        <p className="mt-2 text-sm text-muted-foreground">Playground interno (dev-only).</p>
      </main>
    );
  }

  // Cenários de teste para políticas expandidas
  const principal = 250000;

  // Cenário 1: Alta renda, boa liquidez (esperado: PASS)
  const scenario1 = await getSuitabilityDecision({
    pv: principal,
    rate: 0.01,
    nper: 120,
    income_sources: [
      { type: "clt", amount: 12000 },
      { type: "variable", amount: 5000 }
    ],
    liquidity_months: 8
  });

  // Cenário 2: Renda moderada, liquidez crítica (esperado: BLOCKED)
  const scenario2 = await getSuitabilityDecision({
    pv: principal,
    rate: 0.01,
    nper: 120,
    income_sources: [
      { type: "clt", amount: 6000 }
    ],
    liquidity_months: 2
  });

  // Cenário 3: Alto comprometimento (esperado: WARN/BLOCKED)
  const scenario3 = await getSuitabilityDecision({
    pv: principal,
    rate: 0.01,
    nper: 120,
    income_sources: [
      { type: "clt", amount: 5500 }
    ],
    liquidity_months: 5
  });

  const tco = await getTCODecision(principal);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <header className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Trustware Expanded Policies (v2026.01.v2)</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Testando políticas expandidas: multi-income, liquidity depth, tiered commitment.
            </p>
          </div>
          <div className="rounded border bg-stone-50 px-3 py-1 text-[10px] font-mono uppercase text-muted-foreground">
            Policy v2026.01.v2
          </div>
        </div>
      </header>

      <div className="grid gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Cenário 1: Alta Renda + Boa Liquidez
            </h2>
            <span className="text-[10px] text-muted-foreground">CLT R$ 12k + Variável R$ 5k | Liquidez 8 meses</span>
          </div>
          <SuitabilityAlphaSlot data={scenario1} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Cenário 2: Renda Moderada + Liquidez Crítica
            </h2>
            <span className="text-[10px] text-muted-foreground">CLT R$ 6k | Liquidez 2 meses</span>
          </div>
          <SuitabilityAlphaSlot data={scenario2} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Cenário 3: Alto Comprometimento
            </h2>
            <span className="text-[10px] text-muted-foreground">CLT R$ 5.5k | Liquidez 5 meses</span>
          </div>
          <SuitabilityAlphaSlot data={scenario3} />
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            TCO Expandido (Custos Semânticos)
          </h2>
          <TCOMirrorSlot data={tco} />
        </section>
      </div>

      <footer className="mt-12 border-t pt-6 text-[10px] text-muted-foreground leading-relaxed">
        <p>
          **Aviso de Auditoria:** Políticas expandidas agora incluem agregação multi-income,
          análise de liquidity depth, e commitment ratio tiered (30%/40%).
        </p>
        <p className="mt-2 font-mono opacity-50">Session hash: {Math.random().toString(36).substring(7)}</p>
      </footer>
    </main>
  );
}
