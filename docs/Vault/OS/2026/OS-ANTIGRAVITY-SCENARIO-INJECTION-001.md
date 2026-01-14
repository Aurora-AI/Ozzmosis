# 🧬 OS-ANTIGRAVITY-SCENARIO-INJECTION-001

**Tipo:** Injeção de Mock / Prototipagem Rápida
**Foco:** Popular o Terminal com o Case "Scania"
**Executor:** Antigravity (Aurora)

#### 1. OBJETIVO

Substituir o estado vazio do `TrustwareAuditTerminal` por um **Cenário de Demonstração Hardcoded** que exibe a auditoria de um consórcio de pesados.

#### 2. PAYLOAD DE CÓDIGO (SOBRESCREVER)

**Arquivo Alvo:** `apps/genesis-front/components/terminal/TrustwareAuditTerminal.tsx`

O Executor deve substituir o conteúdo atual por este código, que implementa a estrutura de "Slots" com dados reais de mock:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Activity, FileText, TrendingUp } from 'lucide-react';
// import { AuditSideRail } from './AuditSideRail'; // Unused in this mock layout

// --- TIPOS MOCK ---
type SlotStatus = 'pass' | 'fail' | 'warn' | 'processing';

interface AuditSlotProps {
  label: string;
  value: string;
  status: SlotStatus;
  detail?: string;
  delay?: number;
}

// --- COMPONENTE DE SLOT (Visual Trustware) ---
const AuditSlot = ({ label, value, status, detail, delay = 0 }: AuditSlotProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return <div className="h-24 bg-white/5 rounded-lg animate-pulse" />;

  const statusColor = {
    pass: 'text-green-500 border-green-500/20 bg-green-500/5',
    fail: 'text-red-500 border-red-500/20 bg-red-500/5',
    warn: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
    processing: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
  }[status];

  const Icon = {
    pass: CheckCircle2,
    fail: XCircle,
    warn: AlertCircle,
    processing: Activity,
  }[status];

  return (
    <div className={`p-4 rounded-lg border ${statusColor} border-opacity-30 transition-all duration-500`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">{label}</span>
        <Icon className={`w-4 h-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
      </div>
      <div className="font-mono text-xl font-bold tracking-tight">{value}</div>
      {detail && <div className="mt-2 text-xs font-mono opacity-60 border-t border-white/10 pt-2">{detail}</div>}
    </div>
  );
};

// --- O TERMINAL PRINCIPAL ---
export function TrustwareAuditTerminal() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    setTimeout(() => setBooting(false), 800); // Boot sequence effect
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">

      {/* 1. SIDE RAIL (Navegação Interna) */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="border border-white/10 rounded-xl p-4 bg-black/40 backdrop-blur-xl h-full">
          <div className="mb-6 px-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Contexto Ativo</span>
            <div className="text-sm font-bold text-white mt-1">Frota Scania R540</div>
            <div className="text-xs text-green-500 font-mono mt-1">● Live Stream</div>
          </div>
          <nav className="space-y-1">
            {['Visão Geral', 'Matemática Financeira', 'Conformidade Legal', 'Risco de Crédito'].map((item, i) => (
              <button key={item} className={`w-full text-left px-3 py-2 rounded text-xs font-mono uppercase tracking-wide transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 2. MAIN CONSOLE */}
      <div className="flex-1 space-y-6">

        {/* HEADER DO CONSOLE */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Relatório de Viabilidade</h2>
            <p className="text-gray-500 text-sm font-mono mt-1">HASH: 8f4a...c291 • TRUSTWARE ENGINE v2.1</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded text-green-500 font-mono text-xs font-bold uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Aprovado
             </div>
          </div>
        </div>

        {/* GRID DE DADOS (The Truth) */}
        {booting ? (
           <div className="h-64 flex items-center justify-center font-mono text-xs text-green-500 animate-pulse">
             INICIALIZANDO PROTOCOLOS DE AUDITORIA...
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Linha 1: Financeiro */}
            <AuditSlot label="Crédito Alvo" value="R$ 750.000,00" status="pass" detail="Cobertura: 100% FIPE" delay={100} />
            <AuditSlot label="Taxa Administrativa" value="14.00%" status="pass" detail="Competitividade: Alta" delay={200} />
            <AuditSlot label="Prazo Otimizado" value="92 Meses" status="warn" detail="Sugestão: Reduzir para 85m" delay={300} />

            {/* Linha 2: Performance */}
            <AuditSlot label="Custo Efetivo (CET)" value="1.12% a.m." status="pass" detail="Benchmark: 1.45% a.m." delay={400} />
            <AuditSlot label="Lance Embutido" value="30% (R$ 225k)" status="processing" detail="Calculando probabilidade..." delay={500} />
            <AuditSlot label="Economia Projetada" value="R$ 142.500" status="pass" detail="vs. Financiamento Tradicional" delay={600} />
          </div>
        )}

        {/* LOG DE EXECUÇÃO (Terminal Feel) */}
        {!booting && (
          <div className="mt-8 border border-white/5 rounded-lg bg-black p-4 font-mono text-[10px] text-gray-600 h-32 overflow-hidden font-light">
            <div className="mb-1 text-gray-500">[SYSTEM] Trustware kernel loaded.</div>
            <div className="mb-1 text-gray-500">[AUDIT] Analyzing proposal ID #99281...</div>
            <div className="mb-1 text-green-900">[PASS] Credit score check complete.</div>
            <div className="mb-1 text-green-900">[PASS] Compliance ruleset v4.2 verified.</div>
            <div className="mb-1 text-yellow-900">[WARN] Duration exceeds optimal yield curve by 7 months.</div>
            <div className="mb-1 text-blue-900 animate-pulse">[MATH] Running Monte Carlo simulation for bid strategy...</div>
          </div>
        )}

      </div>
    </div>
  );
}
```
