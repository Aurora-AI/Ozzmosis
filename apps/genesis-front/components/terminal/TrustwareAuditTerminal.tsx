'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Activity, ChevronRight, Terminal } from 'lucide-react';
import { AuditSideRail } from './AuditSideRail';

// --- TIPOS ---
type SlotStatus = 'pass' | 'fail' | 'warn' | 'processing';

interface AuditSlotProps {
  label: string;
  value: string;
  status: SlotStatus;
  detail?: string;
  delay?: number;
}

// --- SLOT UNITÁRIO ---
const AuditSlot = ({ label, value, status, detail, delay = 0 }: AuditSlotProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return (
    <div className="h-32 rounded-xl bg-white/5 border border-white/5 animate-pulse flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );

  const statusConfig = {
    pass: { color: 'text-green-500', border: 'border-green-500/30', bg: 'bg-green-500/5', icon: CheckCircle2 },
    fail: { color: 'text-red-500', border: 'border-red-500/30', bg: 'bg-red-500/5', icon: XCircle },
    warn: { color: 'text-yellow-500', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', icon: AlertCircle },
    processing: { color: 'text-blue-500', border: 'border-blue-500/30', bg: 'bg-blue-500/5', icon: Activity },
  }[status];

  const Icon = statusConfig.icon;

  return (
    <div className={`
      relative overflow-hidden p-5 rounded-xl border ${statusConfig.border} ${statusConfig.bg}
      transition-all duration-700 ease-out hover:scale-[1.02] hover:bg-opacity-10 group
    `}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{label}</span>
        <Icon className={`w-4 h-4 ${statusConfig.color} ${status === 'processing' ? 'animate-spin' : ''}`} />
      </div>

      <div className="font-mono text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
        {value}
      </div>

      {detail && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-xs font-mono text-gray-400">{detail}</span>
        </div>
      )}

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] w-full -translate-y-full group-hover:translate-y-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
};

// --- TERMINAL MAIN ---
export function TrustwareAuditTerminal() {
  const [booting, setBooting] = useState(true);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Simulação de Boot do Kernel Trustware
  useEffect(() => {
    const bootSequence = [
      "Initializing Trustware Kernel v2.1...",
      "Loading cryptographic primitives...",
      "Connecting to Ledger Nodes [SYNC]...",
      "Verifying Policy Ruleset: 'Rodobens_Heavy_Fleet_2026'...",
      "ACCESS GRANTED."
    ];

    let delay = 0;
    bootSequence.forEach((line, index) => {
      delay += 150 + Math.random() * 200;
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
        if (index === bootSequence.length - 1) {
          setTimeout(() => setBooting(false), 600);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] w-full">

      {/* Left Rail */}
      <AuditSideRail />

      {/* Main Display */}
      <div className="flex-1 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tighter">Relatório de Viabilidade</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-gray-300 border border-white/10">
                PROPOSAL #8821-B
              </span>
              <span className="text-xs text-gray-500 font-mono">
                Processado em 14 jan 2026, 16:42 UTC
              </span>
            </div>
          </div>

          {!booting && (
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg animate-in fade-in zoom-in duration-500">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-green-400 uppercase leading-none mb-0.5">Veredito do Sistema</span>
                <span className="text-sm font-bold text-white uppercase tracking-wide">Tecnicamente Aprovado</span>
              </div>
            </div>
          )}
        </div>

        {/* Boot Screen vs Grid */}
        {booting ? (
          <div className="flex-1 bg-black border border-white/10 rounded-xl p-8 font-mono text-sm text-green-500/80 shadow-inner">
            {terminalLines.map((line, i) => (
              <div key={i} className="mb-2 flex gap-3">
                <span className="text-gray-700">{">"}</span>
                <span className="typing-effect">{line}</span>
              </div>
            ))}
            <div className="animate-pulse mt-2">_</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-700 fade-in">
            {/* Linha 1: Core Financials */}
            <AuditSlot
              label="Crédito Disponível"
              value="R$ 750.000"
              status="pass"
              detail="Cobertura 100% Tabela FIPE"
              delay={100}
            />
            <AuditSlot
              label="Taxa Administrativa"
              value="14.00%"
              status="pass"
              detail="Competitividade: Alta (Top 5%)"
              delay={250}
            />
            <AuditSlot
              label="Prazo Otimizado"
              value="92 Meses"
              status="warn"
              detail="Sugerido: Reduzir para 85m"
              delay={400}
            />

            {/* Linha 2: Advanced Metrics */}
            <AuditSlot
              label="Custo Efetivo (CET)"
              value="1.12% a.m."
              status="pass"
              detail="Abaixo do Benchmark (1.45%)"
              delay={550}
            />
            <AuditSlot
              label="Potencial de Lance"
              value="30% (R$ 225k)"
              status="processing"
              detail="Simulando probabilidade..."
              delay={700}
            />
            <AuditSlot
              label="Economia Real"
              value="R$ 142.500"
              status="pass"
              detail="vs. Financiamento CDC"
              delay={850}
            />
          </div>
        )}

        {/* Console Log Footer */}
        {!booting && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs font-mono uppercase">
              <Terminal className="w-3 h-3" />
              <span>System Log</span>
            </div>
            <div className="font-mono text-[10px] text-gray-600 space-y-1">
              <div className="flex gap-2"><span className="text-gray-700">16:42:01</span> <span>[INFO] Credit score analysis complete. Result: AAA.</span></div>
              <div className="flex gap-2"><span className="text-gray-700">16:42:02</span> <span>[INFO] Collateral verified against Scania_2026_Database.</span></div>
              <div className="flex gap-2"><span className="text-gray-700">16:42:03</span> <span className="text-yellow-700/70">[WARN] Duration deviation detected (7 months). Policy allows override.</span></div>
              <div className="flex gap-2"><span className="text-gray-700">16:42:04</span> <span className="text-blue-500 animate-pulse">[RUN] Monte Carlo simulation for bid strategy in progress...</span></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
