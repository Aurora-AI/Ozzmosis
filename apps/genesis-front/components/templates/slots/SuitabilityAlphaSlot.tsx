"use client";

import React from "react";
import { TrustwareStateBadge, type TrustwareState } from "../../trustware/TrustwareStateBadge";
import { TrustwareStateFrame } from "../../trustware/TrustwareStateFrame";

export type SuitabilityAlphaSlotModel = {
  slot_type: "SuitabilityAlphaSlot";
  version: "1.0";
  state: TrustwareState;
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

export function SuitabilityAlphaSlot(props: SuitabilityAlphaSlotProps) {
  const { data, isLoading, error, onExplain } = props;

  if (isLoading) {
    return (
      <TrustwareStateFrame state="insufficient_data" title="Suitability Alpha">
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-40 rounded bg-muted animate-pulse" />
          <div className="h-5 w-24 rounded bg-muted animate-pulse" />
        </div>
        <div className="mt-3 h-4 w-3/4 rounded bg-muted animate-pulse" />
      </TrustwareStateFrame>
    );
  }

  if (error) {
    return (
      <TrustwareStateFrame state="blocked" title="Suitability Alpha">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Falha na integridade do contrato.</p>
          <TrustwareStateBadge state="blocked" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{error}</p>
      </TrustwareStateFrame>
    );
  }

  if (!data) {
    return (
      <TrustwareStateFrame state="insufficient_data" title="Suitability Alpha">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Dados insuficientes para decisão.</p>
          <TrustwareStateBadge state="insufficient_data" />
        </div>
      </TrustwareStateFrame>
    );
  }

  const reasons = data.reasons ?? [];
  const missing = data.missing_fields ?? [];

  return (
    <TrustwareStateFrame state={data.state} title="Suitability Alpha">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{data.headline}</p>
          {data.summary ? <p className="mt-1 text-xs text-muted-foreground">{data.summary}</p> : null}
        </div>
        <TrustwareStateBadge state={data.state} />
      </header>

      {data.state === "insufficient_data" ? (
        <div className="mt-4 rounded-xl border bg-surface-alt p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado Ético</p>
          <p className="mt-1 text-sm text-foreground">
            Sincronizando telemetria técnica... Não inferimos sem fatos mínimos.
          </p>

          {missing.length > 0 ? (
            <ul className="mt-3 space-y-1 list-disc pl-5 text-xs text-muted-foreground">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {reasons.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Motivos (auditáveis)</p>
          <ul className="mt-2 space-y-2">
            {reasons.map((r) => (
              <li key={r.code} className="rounded-lg border bg-surface-alt p-3">
                <p className="text-sm font-medium text-foreground">{r.message}</p>
                {r.evidence ? <p className="mt-1 text-[10px] font-mono text-muted-foreground opacity-70">{r.evidence}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <p className="text-[10px] text-muted-foreground max-w-[240px]">
          Terminal de auditoria. Nenhuma decisão automática ou persuasão comercial.
        </p>

        {onExplain ? (
          <button
            type="button"
            onClick={onExplain}
            className="rounded border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors"
          >
            Auditar Ponto
          </button>
        ) : null}
      </div>
    </TrustwareStateFrame>
  );
}
