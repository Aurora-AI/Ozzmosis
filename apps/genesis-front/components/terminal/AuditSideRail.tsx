'use client';

import { Activity, Database, FileCode, Lock, Settings, ShieldAlert } from "lucide-react";

export function AuditSideRail() {
  const menuItems = [
    { icon: Activity, label: "Live Telemetry", active: true },
    { icon: Database, label: "Data Sources", active: false },
    { icon: ShieldAlert, label: "Risk Policy", active: false },
    { icon: FileCode, label: "Smart Contracts", active: false },
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
      {/* Context Card */}
      <div className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">System Online</span>
        </div>

        <div className="space-y-1 mb-4">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Alvo da Auditoria</span>
          <div className="text-sm font-bold text-white leading-tight">Frota Scania R540</div>
          <div className="text-xs text-gray-400 font-mono">ID: #9928-AX</div>
        </div>

        <div className="h-px w-full bg-white/10 mb-4" />

        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>Trust Score</span>
          <span className="text-green-400 font-bold">98/100</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`
              group flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wide transition-all
              ${item.active
                ? 'bg-white/10 text-white border border-white/10'
                : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'}
            `}
          >
            <item.icon className={`w-4 h-4 ${item.active ? 'text-green-500' : 'text-gray-600 group-hover:text-gray-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-gray-700">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] font-mono">E2E Encrypted</span>
        </div>
      </div>
    </div>
  );
}
