"use client";

import React from "react";
import { TrustwareStateBadge, type TrustwareState } from "../trustware/TrustwareStateBadge";

export type AuditSideRailProps = {
  telemetryStatus: TrustwareState;
  slotCount: number;
  stateDistribution: {
    pass: number;
    warn: number;
    blocked: number;
    insufficient_data: number;
  };
};

export function AuditSideRail({ telemetryStatus, slotCount, stateDistribution }: AuditSideRailProps) {
  const total = slotCount || 1;
  const passPercent = (stateDistribution.pass / total) * 100;
  const warnPercent = (stateDistribution.warn / total) * 100;
  const blockedPercent = (stateDistribution.blocked / total) * 100;
  const insufficientPercent = (stateDistribution.insufficient_data / total) * 100;

  return (
    <aside style={{ width: "280px" }}>
      <div className="sticky" style={{ top: "var(--space-4)" }}>
        {/* Telemetry Status */}
        <section className="rounded-xl border p-2.5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <h3 className="font-bold uppercase tracking-widest" style={{ fontSize: "9px", color: "var(--color-fg)", opacity: 0.6 }}>
            Telemetria
          </h3>
          <div className="mt-1.5">
            <TrustwareStateBadge state={telemetryStatus} />
          </div>
        </section>

        {/* Slot Summary */}
        <section className="mt-3 rounded-xl border p-2.5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <h3 className="font-bold uppercase tracking-widest" style={{ fontSize: "9px", color: "var(--color-fg)", opacity: 0.6 }}>
            Slots Auditados
          </h3>
          <p className="mt-1.5 font-mono font-bold" style={{ fontSize: "var(--text-xl)", color: "var(--color-fg)" }}>
            {slotCount}
          </p>
        </section>

        {/* State Distribution */}
        <section className="mt-3 rounded-xl border p-2.5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <h3 className="font-bold uppercase tracking-widest" style={{ fontSize: "9px", color: "var(--color-fg)", opacity: 0.6 }}>
            Distribuição
          </h3>

          <div className="mt-2 space-y-2">
            {/* Pass Bar */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>Verificado</span>
                <span className="font-mono" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>{stateDistribution.pass}</span>
              </div>
              <div className="h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${passPercent}%`,
                    backgroundColor: "color-mix(in srgb, var(--trustware-pass) 60%, transparent)"
                  }}
                />
              </div>
            </div>

            {/* Warn Bar */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>Atenção</span>
                <span className="font-mono" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>{stateDistribution.warn}</span>
              </div>
              <div className="h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${warnPercent}%`,
                    backgroundColor: "color-mix(in srgb, var(--trustware-warn) 60%, transparent)"
                  }}
                />
              </div>
            </div>

            {/* Blocked Bar */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>Bloqueado</span>
                <span className="font-mono" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>{stateDistribution.blocked}</span>
              </div>
              <div className="h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${blockedPercent}%`,
                    backgroundColor: "color-mix(in srgb, var(--trustware-blocked) 60%, transparent)"
                  }}
                />
              </div>
            </div>

            {/* Insufficient Bar */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>Insuficiente</span>
                <span className="font-mono" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.7 }}>{stateDistribution.insufficient_data}</span>
              </div>
              <div className="h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${insufficientPercent}%`,
                    backgroundColor: "color-mix(in srgb, var(--trustware-insufficient) 60%, transparent)"
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Logs (collapsed) */}
        <section className="mt-3 rounded-xl border p-2.5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <h3 className="font-bold uppercase tracking-widest" style={{ fontSize: "9px", color: "var(--color-fg)", opacity: 0.6 }}>
            Registros
          </h3>
          <p className="mt-1.5" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.5 }}>
            Sistema operacional. Apenas leitura.
          </p>
        </section>
      </div>
    </aside>
  );
}
