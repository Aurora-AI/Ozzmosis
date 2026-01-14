"use client";

import React from "react";
import { TrustwareStateFrame } from "../../trustware/TrustwareStateFrame";

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
      <TrustwareStateFrame state="insufficient_data" title="TCO Mirror">
        <div className="h-5 w-48 rounded bg-muted animate-pulse" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-full rounded bg-muted animate-pulse" />
          ))}
        </div>
      </TrustwareStateFrame>
    );
  }

  if (error) {
    return (
      <TrustwareStateFrame state="blocked" title="TCO Mirror">
        <p className="text-sm font-medium text-foreground">Falha na integridade do contrato.</p>
        <p className="mt-2 text-xs text-muted-foreground">{error}</p>
      </TrustwareStateFrame>
    );
  }

  if (!data) {
    return (
      <TrustwareStateFrame state="insufficient_data" title="TCO Mirror">
        <p className="text-sm font-medium text-foreground">Dados insuficientes para decisão.</p>
      </TrustwareStateFrame>
    );
  }

  return (
    <TrustwareStateFrame state="insufficient_data" title="TCO Mirror">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{data.headline ?? "Custo total de vida (TCO) — exposição"}</p>
          <p className="mt-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{data.disclaimer}</p>
        </div>

        {onExplain ? (
          <button
            type="button"
            onClick={onExplain}
            className="rounded border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors"
          >
            Auditar Cálculo
          </button>
        ) : null}
      </header>

      <div className="mt-4 overflow-hidden rounded-xl border bg-surface-alt">
        <table className="w-full border-collapse">
          <tbody>
            {data.lines.map((line) => (
              <tr key={line.key} className="border-b last:border-b-0">
                <td className="px-3 py-2 text-xs text-foreground">{line.label}</td>
                <td className="px-3 py-2 text-right text-xs font-mono text-foreground">
                  {formatMoneyBRL(line.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-xl border bg-surface-alt p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Comparação (Auditável)</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {data.bank_alternative?.headline ?? "Alternativa bancária (não conectada)"}
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded border bg-background p-2">
            <p className="text-[10px] uppercase text-muted-foreground">Custo mensal</p>
            <p className="mt-1 text-xs font-mono font-medium text-foreground">
              {formatMoneyBRL(data.bank_alternative?.monthly_cost)}
            </p>
          </div>
          <div className="rounded border bg-background p-2">
            <p className="text-[10px] uppercase text-muted-foreground">Custo total</p>
            <p className="mt-1 text-xs font-mono font-medium text-foreground">
              {formatMoneyBRL(data.bank_alternative?.total_cost)}
            </p>
          </div>
        </div>

        {data.bank_alternative?.note ? (
          <p className="mt-2 text-[10px] text-muted-foreground italic">{data.bank_alternative.note}</p>
        ) : null}
      </div>

      <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed border-t pt-4">
        Este slot expõe linhas e ausências. Terminal de auditoria: não calcula automaticamente, não otimiza fluxo e não visa conversão comercial.
      </p>
    </TrustwareStateFrame>
  );
}
