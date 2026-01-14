"use client";

import React from "react";
import { ShellLayout } from "../../../components/wealth/layout/ShellLayout";
import { CinematicHero } from "../../../components/wealth/shell/CinematicHero";
import { AssetCard } from "../../../components/wealth/shell/AssetCard";
import mockData from "../../../data/mocks/wealth_shell.json";
import { TrendingUp, Users, Target } from "lucide-react";

export default function WealthDashboardPage() {
  const { metrics, opportunities } = mockData;

  return (
    <ShellLayout title="Visão Geral" breadcrumb={["Wealth", "Dashboard"]}>
      <div className="space-y-8">

        {/* Welcome Hero */}
        <CinematicHero
          title="O futuro do patrimônio é digital."
          subtitle="Gerencie sua carteira de clientes de alta renda com precisão clínica e autoridade de mercado."
          ctaText="Ver Oportunidades"
        />

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs uppercase tracking-widest text-white/40">Vendas (Mês)</span>
            </div>
            <p className="text-2xl font-light text-white">{metrics.monthlySales}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-xs uppercase tracking-widest text-white/40">Projeção (Comissão)</span>
            </div>
            <p className="text-2xl font-light text-white">{metrics.projectedCommission}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs uppercase tracking-widest text-white/40">Deals Ativos</span>
            </div>
            <p className="text-2xl font-light text-white">{metrics.activeDeals}</p>
          </div>
        </div>

        {/* Priority Assets */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Oportunidades Prioritárias</h2>
            <button className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">Ver todas</button>
          </div>

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
        </section>
      </div>
    </ShellLayout>
  );
}
