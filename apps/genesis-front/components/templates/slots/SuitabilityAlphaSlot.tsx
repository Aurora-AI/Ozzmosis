"use client";

import React from "react";

type SuitabilityState = "blocked" | "warn" | "pass" | "insufficient_data";

export type SuitabilityAlphaSlotModel = {
  slot_type: "SuitabilityAlphaSlot";
  version: "1.0";
  state: SuitabilityState;
  headline: string;
  summary?: string;
  liquidity?: number | null;
  reasons?: Array<{ code: string; message: string; evidence?: string }>;
  missing_fields?: string[];
  explain?: { title?: string; body?: string };
};

export type SuitabilityAlphaSlotProps = {
  data?: SuitabilityAlphaSlotModel | null;
  isLoading?: boolean;
  error?: string | null;
  onExplain?: () => void; // “Entenda este ponto” (educativo; não conversão)
};

function Badge({ state }: { state: SuitabilityState }) {
  const label =
    state === "pass"
      ? "Aprovado"
      : state === "warn"
      ? "Atenção"
      : state === "blocked"
      ? "Bloqueado"
      : "Dados insuficientes";

  // Tokens-only: classes sem cores hardcoded.
  const cls =
    state === "pass"
      ? "bg-muted text-foreground"
      : state === "warn"
      ? "bg-muted text-foreground"
      : state === "blocked"
      ? "bg-muted text-foreground"
      : "bg-muted text-foreground";

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export function SuitabilityAlphaSlot(props: SuitabilityAlphaSlotProps) {
  const { data, isLoading, error, onExplain } = props;

  if (isLoading) {
    return (
      <section className="rounded-2xl border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-5 w-24 rounded bg-muted" />
        </div>
        <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
        <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">Suitability Alpha</h3>
          <Badge state="insufficient_data" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível validar este slot (erro de contrato/entrada). Nenhuma inferência foi feita.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">Suitability Alpha</h3>
          <Badge state="insufficient_data" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Dados insuficientes para exibir a integridade deste cenário.
        </p>
      </section>
    );
  }

  const reasons = data.reasons ?? [];
  const missing = data.missing_fields ?? [];

  return (
    <section className="rounded-2xl border bg-background p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Suitability Alpha</h3>
          <p className="mt-1 text-sm text-foreground">{data.headline}</p>
          {data.summary ? <p className="mt-1 text-sm text-muted-foreground">{data.summary}</p> : null}
        </div>
        <Badge state={data.state} />
      </header>

      {data.state === "insufficient_data" ? (
        <div className="mt-4 rounded-xl border bg-background p-3">
          <p className="text-sm font-medium text-foreground">Dados insuficientes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Este estado é ético: não inferimos sem fatos mínimos.
          </p>

          {missing.length > 0 ? (
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {reasons.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">Motivos (auditáveis)</p>
          <ul className="mt-2 space-y-2">
            {reasons.map((r) => (
              <li key={r.code} className="rounded-xl border bg-background p-3">
                <p className="text-sm font-medium text-foreground">{r.message}</p>
                {r.evidence ? <p className="mt-1 text-xs text-muted-foreground">{r.evidence}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Nenhuma decisão é tomada aqui. Este slot apenas expõe estado e evidências.
        </p>

        {/* Anti-venda: permitido apenas educativo */}
        {onExplain ? (
          <button
            type="button"
            onClick={onExplain}
            className="rounded-lg border bg-background px-3 py-2 text-xs font-medium text-foreground"
            aria-label="Entenda este ponto"
          >
            Entenda este ponto
          </button>
        ) : null}
      </div>
    </section>
  );
}
