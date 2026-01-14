"use client";

import React, { ReactNode } from "react";
import { TrustwareState } from "./TrustwareStateBadge";

interface TrustwareStateFrameProps {
  state: TrustwareState;
  title?: string;
  children: ReactNode;
}

const STATE_COLORS = {
  pass: "var(--trustware-pass)",
  warn: "var(--trustware-warn)",
  blocked: "var(--trustware-blocked)",
  insufficient_data: "var(--trustware-insufficient)",
};

export function TrustwareStateFrame({ state, title, children }: TrustwareStateFrameProps) {
  const colorVar = STATE_COLORS[state];

  return (
    <div
      className="rounded-2xl border bg-background transition-colors duration-200"
      style={{
        borderColor: `color-mix(in srgb, ${colorVar} 20%, var(--color-border))`,
      }}
    >
      {title && (
        <div className="border-b px-4 py-2">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {title}
          </h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
