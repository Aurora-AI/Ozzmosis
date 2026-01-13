import React from "react";
import { SuitabilityAlphaSlot } from "../../../components/templates/slots/SuitabilityAlphaSlot";
import { TCOMirrorSlot } from "../../../components/templates/slots/TCOMirrorSlot";
import { suitabilityDemos, tcoDemo } from "../../../components/templates/slots/__demo__/trustwareSlotDemos";

export const metadata = {
  title: "Dev — Trustware Slots Playground"
};

function DevGate({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-base font-semibold text-foreground">Indisponível</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Playground interno (dev-only). Nenhuma inferência foi feita.
        </p>
      </main>
    );
  }
  return <>{children}</>;
}

export default function TrustwareSlotsPlaygroundPage() {
  return (
    <DevGate>
      <main className="mx-auto max-w-4xl p-6">
        <header className="mb-6">
          <h1 className="text-lg font-semibold text-foreground">Trustware Slots Playground</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Página interna para validação visual. Zero marketing. Zero CTA de conversão.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Suitability Alpha — estados</h2>
          <div className="grid gap-4">
            <SuitabilityAlphaSlot data={suitabilityDemos.pass} />
            <SuitabilityAlphaSlot data={suitabilityDemos.warn} />
            <SuitabilityAlphaSlot data={suitabilityDemos.blocked} />
            <SuitabilityAlphaSlot data={suitabilityDemos.insufficient_data} />
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">TCO Mirror — demo</h2>
          <TCOMirrorSlot data={tcoDemo} />
        </section>

        <footer className="mt-10 text-xs text-muted-foreground">
          Conteúdo ilustrativo. Nenhum cálculo, nenhuma recomendação, nenhuma conversão.
        </footer>
      </main>
    </DevGate>
  );
}
