import React from "react";
import { SuitabilityAlphaSlot } from "../../../components/templates/slots/SuitabilityAlphaSlot";
import { TCOMirrorSlot } from "../../../components/templates/slots/TCOMirrorSlot";
import { getSuitabilityDecision, getTCODecision } from "../../../src/lib/trustware/decisions";

export const metadata = {
  title: "Dev — Trustware Slots Live Audit"
};

/**
 * Dev Page - Agora conectada a decisões reais via Toolbelt (Server-side)
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

  // Simulação de Auditoria Real (Server-side call ao orchestrator)
  const principal = 250000;
  const [suitability, tco] = await Promise.all([
    getSuitabilityDecision({ pv: principal, rate: 0.01, nper: 120 }),
    getTCODecision(principal)
  ]);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <header className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Trustware Live Audit</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Auditando cenário real via **Toolbelt Decision Engine**.
            </p>
          </div>
          <div className="rounded border bg-stone-50 px-3 py-1 text-[10px] font-mono uppercase text-muted-foreground">
            Audit Mode: Deterministic
          </div>
        </div>
      </header>

      <div className="grid gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Integridade de Perfil (Suitability)
            </h2>
            <span className="text-[10px] text-muted-foreground">Input: PV {principal.toLocaleString("pt-BR")}</span>
          </div>
          <SuitabilityAlphaSlot data={suitability} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Exposição de Custo Real (TCO)
          </h2>
          <TCOMirrorSlot data={tco} />
        </section>
      </div>

      <footer className="mt-12 border-t pt-6 text-[10px] text-muted-foreground leading-relaxed">
        <p>
          **Aviso de Auditoria:** Este ambiente consome o Toolbelt CLI localmente.
          As decisões são 100% determinísticas baseadas no kernel financeiro da Elysian.
        </p>
        <p className="mt-2 font-mono opacity-50">Session hash: {Math.random().toString(36).substring(7)}</p>
      </footer>
    </main>
  );
}
