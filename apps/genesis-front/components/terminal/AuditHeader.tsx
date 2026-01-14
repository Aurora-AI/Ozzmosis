"use client";

import React from "react";

export type AuditHeaderProps = {
  sessionId?: string;
  productContext?: string;
  timestamp?: string;
};

export function AuditHeader({ sessionId, productContext, timestamp }: AuditHeaderProps) {
  const displayTimestamp = timestamp || new Date().toISOString().split('T')[0];

  return (
    <header className="border-b" style={{ borderColor: "var(--color-border)", height: "56px" }}>
      <div className="g-container h-full flex items-center justify-between">
        <div>
          <h1 className="font-semibold" style={{ fontSize: "var(--text-sm)", color: "var(--color-fg)" }}>
            Terminal de Auditoria Trustware
          </h1>
          {productContext && (
            <p className="mt-0.5" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.6 }}>
              {productContext}
            </p>
          )}
        </div>

        <div className="text-right">
          {sessionId && (
            <p className="font-mono" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.5 }}>
              {sessionId}
            </p>
          )}
          <p className="font-mono mt-0.5" style={{ fontSize: "10px", color: "var(--color-fg)", opacity: 0.4 }}>
            {displayTimestamp}
          </p>
        </div>
      </div>
    </header>
  );
}
