"use client";

import React from "react";
import { ArrowUpRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface AssetCardProps {
  id: string;
  title: string;
  value: string;
  status: "approved" | "analysis" | "blocked";
  product: string;
}

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    label: "Aprovado"
  },
  analysis: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    label: "Em Análise"
  },
  blocked: {
    icon: AlertCircle,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    label: "Bloqueado"
  }
};

export function AssetCard({ id, title, value, status, product }: AssetCardProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]">
      <div>
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-white/50">
            {product}
          </span>
          <div className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-wider ${config.bg} ${config.border} ${config.color}`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </div>
        </div>

        <h3 className="mt-4 font-serif text-xl text-white group-hover:text-white/90">
          {title}
        </h3>
        <p className="mt-1 text-2xl font-light tracking-tight text-white/80">
          {value}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs text-white/30">ID: {id.toUpperCase()}</span>
        <Link
          href={`/wealth/audit/${id}`}
          className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-emerald-400 opacity-60 transition-opacity hover:opacity-100"
        >
          Auditar
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
