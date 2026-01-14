"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function WealthLandingPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#000000]">
      {/* Background (Cinematic) */}
       <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614026480209-cd9c3d523b12?q=80&w=2787&auto=format&fit=crop')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-md">
           <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-black" />
           </div>
        </div>

        <h1 className="max-w-4xl font-serif text-6xl tracking-tight text-white md:text-8xl drop-shadow-2xl">
          Genesis <span className="opacity-50">Wealth</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light text-white/60">
          A plataforma definitiva para originação, análise e auditoria de grandes patrimônios.
        </p>

        <div className="mt-12 flex items-center gap-4">
          <Link
            href="/wealth/dashboard"
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Acessar Console
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="rounded-full border border-white/20 bg-transparent px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10">
            Solicitar Acesso
          </button>
        </div>

        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-white/20">
          Powered by Trustware Engine v2026.1
        </p>
      </div>
    </div>
  );
}
