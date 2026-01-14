"use client";

import React from "react";
import { TrustwareSlotRenderer } from "../templates/slots/TrustwareSlotRenderer";
import { AuditHeader } from "./AuditHeader";
import { AuditSideRail } from "./AuditSideRail";
import type { TrustwareState } from "../trustware/TrustwareStateBadge";

export type TrustwareAuditTerminalProps = {
  slots: unknown[];
  sessionId?: string;
  productContext?: string;
  timestamp?: string;
};

function calculateStateDistribution(slots: unknown[]) {
  const distribution = {
    pass: 0,
    warn: 0,
    blocked: 0,
    insufficient_data: 0,
  };

  slots.forEach((slot) => {
    const state = (slot as Record<string, unknown>)?.state as string | undefined;
    if (state && state in distribution) {
      distribution[state as keyof typeof distribution]++;
    } else {
      distribution.insufficient_data++;
    }
  });

  return distribution;
}

function deriveTelemetryStatus(distribution: ReturnType<typeof calculateStateDistribution>): TrustwareState {
  if (distribution.blocked > 0) return "blocked";
  if (distribution.warn > 0) return "warn";
  if (distribution.insufficient_data > 0) return "insufficient_data";
  return "pass";
}

export function TrustwareAuditTerminal({ slots, sessionId, productContext, timestamp }: TrustwareAuditTerminalProps) {
  const [focusedSlotIndex, setFocusedSlotIndex] = React.useState<number | null>(null);

  const stateDistribution = calculateStateDistribution(slots);
  const telemetryStatus = deriveTelemetryStatus(stateDistribution);

  // Clear focus when clicking comfortably outside slots
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFocusedSlotIndex(null);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}
      onClick={() => setFocusedSlotIndex(null)} // Click anywhere on background clears focus
    >
      <AuditHeader sessionId={sessionId} productContext={productContext} timestamp={timestamp} />

      <div className="g-container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-16)" }}>
        <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 2fr 280px" }}>
          {/* Left spacer for visual balance */}
          <div onClick={handleBackgroundClick} className="cursor-default" />

          {/* Main Audit Stack */}
          <main className="space-y-6" onClick={(e) => e.stopPropagation()}>
            {slots.length === 0 ? (
              <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg)", opacity: 0.6 }}>
                  Nenhum slot para auditoria. Sistema aguardando telemetria.
                </p>
              </div>
            ) : (
              slots.map((slot, index) => {
                const isFocused = focusedSlotIndex === index;
                // Dim if something else is focused, otherwise normal
                const isDimmed = focusedSlotIndex !== null && !isFocused;

                return (
                  <TrustwareSlotRenderer
                    key={index}
                    payload={slot}
                    isFocused={isFocused}
                    isDimmed={isDimmed}
                    onFocus={() => setFocusedSlotIndex(index)}
                  />
                );
              })
            )}
          </main>

          {/* Side Rail */}
          <AuditSideRail
            telemetryStatus={telemetryStatus}
            slotCount={slots.length}
            stateDistribution={stateDistribution}
          />
        </div>
      </div>
    </div>
  );
}
