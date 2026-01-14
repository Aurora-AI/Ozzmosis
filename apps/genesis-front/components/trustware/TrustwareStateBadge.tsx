"use client";

import React from "react";

export type TrustwareState = "pass" | "warn" | "blocked" | "insufficient_data";

interface TrustwareStateBadgeProps {
  state: TrustwareState;
  label?: string;
}

const STATE_MAPPING = {
  pass: {
    label: "Verificado",
    colorVar: "var(--trustware-pass)",
  },
  warn: {
    label: "Atenção",
    colorVar: "var(--trustware-warn)",
  },
  blocked: {
    label: "Bloqueado",
    colorVar: "var(--trustware-blocked)",
  },
  insufficient_data: {
    label: "Dados insuficientes",
    colorVar: "var(--trustware-insufficient)",
  },
};

export function TrustwareStateBadge({ state, label }: TrustwareStateBadgeProps) {
  const config = STATE_MAPPING[state];
  const displayLabel = label || config.label;

  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider border"
      style={{
        color: config.colorVar,
        borderColor: `color-mix(in srgb, ${config.colorVar} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${config.colorVar} 10%, transparent)`,
      }}
      aria-label={`Estado Trustware: ${displayLabel}`}
    >
      {displayLabel}
    </span>
  );
}
