"use client";

import React from "react";
import { Fingerprint } from "lucide-react";

export function TrustwareTerminalMount() {
  return (
    <div className="group relative flex h-[600px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 transition-colors hover:border-white/20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/20 transition-colors group-hover:text-white/40">
        <Fingerprint className="h-8 w-8" />
      </div>
      <h3 className="mt-6 font-mono text-sm uppercase tracking-widest text-white/40">
        Sistema Clínico Inativo (Placeholder)
      </h3>
      <p className="mt-2 text-xs text-white/30">
        Aguardando injeção do Trustware Core
      </p>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
    </div>
  );
}
