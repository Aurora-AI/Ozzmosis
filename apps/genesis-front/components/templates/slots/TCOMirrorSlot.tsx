"use client";

import React from "react";

type TcoLineKey =
  | "parcel"
  | "admin_fee"
  | "itbi"
  | "deed"
  | "registry"
  | "insurance"
  | "post_contemplation_cost";

export type TCOMirrorSlotModel = {
  slot_type: "TCOMirrorSlot";
  version: "1.0";
  disclaimer: "valores estimados — cálculo não conectado";
  headline?: string;
  lines: Array<{
    key: TcoLineKey;
    label: string;
    amount: number | null;
    note?: string;
  }>;
  bank_alternative?: {
    headline?: string;
    monthly_cost?: number | null;
    total_cost?: number | null;
    note?: string;
  };
  explain?: { title?: string; body?: string };
};

export type TCOMirrorSlotProps = {
  data?: TCOMirrorSlotModel | null;
  isLoading?: boolean;
  error?: string | null;
  onExplain?: () => void; // “Por que isso importa?” (educativo; não conversão)
};

function formatMoneyBRL(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  } catch {
    return String(v);
  }
}

export function TCOMirrorSlot(props: TCOMirrorSlotProps) {
  const { data, isLoading, error, onExplain } = props;

  if (isLoading) {
    return (
      <section className="rounded-2xl border bg-background p-4">
        <div className="h-5 w-48 rounded bg-muted" />
        <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border bg-background p-4">
        <h3 className="text-sm font-semibold text-foreground">TCO Mirror</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível exibir o espelho de custo total (erro de contrato/entrada). Nenhuma inferência foi feita.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl border bg-background p-4">
        <h3 className="text-sm font-semibold text-foreground">TCO Mirror</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Dados insuficientes para exibir o espelho de custo total.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-background p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">TCO Mirror</h3>
          <p className="mt-1 text-sm text-foreground">{data.headline ?? "Custo total de vida (TCO) — exposição"}</p>
          <p className="mt-1 text-xs text-muted-foreground">{data.disclaimer}</p>
        </div>

        {/* Anti-venda: permitido apenas educativo */}
        {onExplain ? (
          <button
            type="button"
            onClick={onExplain}
            className="rounded-lg border bg-background px-3 py-2 text-xs font-medium text-foreground"
            aria-label="Por que isso importa?"
          >
            Por que isso importa?
          </button>
        ) : null}
      </header>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <table className="w-full border-collapse">
          <tbody>
            {data.lines.map((line) => (
              <tr key={line.key} className="border-b last:border-b-0">
                <td className="px-3 py-3 text-sm text-foreground">{line.label}</td>
                <td className="px-3 py-3 text-right text-sm font-medium text-foreground">
                  {formatMoneyBRL(line.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-xl border bg-background p-3">
        <p className="text-xs font-medium text-muted-foreground">Comparação (placeholder)</p>
        <p className="mt-1 text-sm text-foreground">
          {data.bank_alternative?.headline ?? "Alternativa bancária (não conectada)"}
        </p>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Custo mensal</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatMoneyBRL(data.bank_alternative?.monthly_cost)}
            </p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Custo total</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatMoneyBRL(data.bank_alternative?.total_cost)}
            </p>
          </div>
        </div>

        {data.bank_alternative?.note ? (
          <p className="mt-2 text-xs text-muted-foreground">{data.bank_alternative.note}</p>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Este slot expõe linhas e ausências. Não calcula, não otimiza e não converte.
      </p>
    </section>
  );
}
