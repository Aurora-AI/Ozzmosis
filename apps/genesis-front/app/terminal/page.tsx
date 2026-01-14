"use client";

import { TrustwareAuditTerminal } from '@/components/terminal/TrustwareAuditTerminal';

export default function TerminalPage() {
  return (
    // Força o tema escuro (Black Piano) apenas nesta rota, ignorando o layout branco
    <div className="min-h-screen bg-black text-gray-200 font-mono selection:bg-green-900 selection:text-white" style={{
        "--color-bg": "#000000",
        "--color-surface": "#0a0a0a",
        "--color-fg": "#e5e5e5",
        "--color-border": "rgba(255, 255, 255, 0.1)",
        "--trustware-pass": "#22c55e",
        "--trustware-warn": "#f59e0b",
        "--trustware-blocked": "#ef4444",
        "--trustware-insufficient": "#737373",
        "--text-sm": "0.875rem",
        "--text-xl": "1.25rem",
        "--space-4": "1rem",
        "--space-6": "1.5rem",
        "--space-12": "3rem",
    } as React.CSSProperties}>

      {/* Header Minimalista do Terminal */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
           <span className="text-xs tracking-[0.2em] uppercase text-gray-500">Genesis <span className="text-white">Trustware</span> Protocol</span>
        </div>
        <a href="/" className="text-xs text-gray-600 hover:text-white transition-colors uppercase tracking-widest">
          Sair do Terminal
        </a>
      </header>

      {/* O Núcleo Clínico */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
         <TrustwareAuditTerminal
            slots={[]} // Empty for now as per OS
            sessionId="SESSION-INIT-001"
            productContext="TRUSTWARE-CORE-V1"
         />
      </main>

    </div>
  );
}
