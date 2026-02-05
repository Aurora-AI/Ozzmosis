"use client";

import React from "react";
import { ShellLayout } from "./ShellLayout";

interface TrustwareFocusModeProps {
  children: React.ReactNode;
}

export function TrustwareFocusMode({ children }: TrustwareFocusModeProps) {
  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* Background Shell (Dimmed) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ShellLayout title="Auditoria em Curso" breadcrumb={["Wealth", "Audit", "Terminal"]} focusMode={true}>
           {/* Placeholder content to show layout exists but is dimmed */}
           <div className="h-64 w-full animate-pulse rounded-3xl bg-white/5 opacity-50" />
        </ShellLayout>
      </div>

      {/* Focused Content (The Terminal) */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-6xl animate-in fade-in zoom-in-95 duration-500">
           {children}
        </div>
      </div>
    </div>
  );
}
