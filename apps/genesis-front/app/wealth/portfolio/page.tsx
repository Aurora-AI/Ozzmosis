"use client";

import React from "react";
import { ShellLayout } from "../../../components/wealth/layout/ShellLayout";
import { AssetCard } from "../../../components/wealth/shell/AssetCard";
import mockData from "../../../data/mocks/wealth_shell.json";
import { Filter } from "lucide-react";

export default function WealthPortfolioPage() {
  const { opportunities } = mockData;

  return (
    <ShellLayout title="Carteira de Ativos" breadcrumb={["Wealth", "Portfolio"]}>
      <div className="space-y-8">

        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex gap-2">
            <button className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black">Todas</button>
            <button className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors">Aprovadas</button>
            <button className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors">Em Análise</button>
            <button className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors">Bloqueadas</button>
          </div>
          <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <AssetCard
              key={opp.id}
              id={opp.id}
              title={opp.title}
              value={opp.value}
              status={opp.status as "approved" | "analysis" | "blocked"}
              product={opp.product}
            />
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}
