"use client";

import React, { ReactNode } from "react";
import { TrustwareState } from "./TrustwareStateBadge";

export type TrustwareMetadataItem = {
  label: string;
  value: string;
};

interface TrustwareStateFrameProps {
  state: TrustwareState;
  title?: string;
  children: ReactNode;
  isFocused?: boolean;
  isDimmed?: boolean;
  onFocus?: () => void;
  metadata?: TrustwareMetadataItem[];
}

const STATE_COLORS = {
  pass: "var(--trustware-pass)",
  warn: "var(--trustware-warn)",
  blocked: "var(--trustware-blocked)",
  insufficient_data: "var(--trustware-insufficient)",
};

export function TrustwareStateFrame({
  state,
  title,
  children,
  isFocused,
  isDimmed,
  onFocus,
  metadata,
}: TrustwareStateFrameProps) {
  const colorVar = STATE_COLORS[state];

  // Clinical opacity handling
  const opacity = isDimmed ? 0.4 : 1;
  const filter = isDimmed ? "grayscale(0.5)" : "none";

  // Focus emphasis (stronger border + slight lift)
  const borderMix = isFocused
    ? `color-mix(in srgb, ${colorVar} 50%, var(--color-border))`
    : `color-mix(in srgb, ${colorVar} 15%, var(--color-border))`;

  const shadow = isFocused ? "0 4px 20px -10px rgba(0, 0, 0, 0.1)" : "none";
  const bg = isFocused
    ? "color-mix(in srgb, var(--color-bg) 98%, var(--color-fg))"
    : "bg-background";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Prevent clearing focus immediately
        onFocus?.();
      }}
      className={`rounded-2xl border transition-all duration-200 ease-out cursor-default ${bg}`}
      style={{
        borderColor: borderMix,
        opacity,
        filter,
        boxShadow: shadow,
        // Removed persuasive scale transform
      }}
      data-testid={`trustware-frame-${state}`}
    >
      {title && (
        <div className="border-b px-4 py-1.5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-80">
            {title}
          </h3>
        </div>
      )}
      <div className="px-4 py-3">{children}</div>

      {/* Progressive Disclosure: Technical Metadata (Only on Focus) */}
      {isFocused && metadata && metadata.length > 0 && (
        <div
          className="border-t bg-stone-50/40 px-4 py-3"
          style={{ borderColor: "var(--color-border)" }}
          data-testid="trustware-metadata-panel"
        >
          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">
            Metadados de Auditoria
          </h4>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {metadata.map((item, idx) => (
              <div key={idx}>
                <p className="text-[9px] uppercase tracking-wide text-muted-foreground opacity-60">
                  {item.label}
                </p>
                <p className="font-mono text-[10px] text-foreground opacity-80">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
