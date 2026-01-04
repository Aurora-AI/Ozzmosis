"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProject } from "@/hooks/useProject";
import { GanttGrid } from "@/components/gantt/GanttGrid";

export default function Page() {
  const { projects, tasks, status, error, retrying, projectsNotice, tasksNotice } = useProject();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-2xl font-semibold">Chronos Backoffice</div>
          <div className="mt-1 text-sm opacity-70">
            Órgão padrão do ecossistema. DEV: mock local. PROD: Butantan Shield obrigatório.
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, repeat: status === "loading" ? Infinity : 0, repeatType: "reverse" }}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs"
        >
          <div>Status: {status}</div>
          {retrying ? <div className="opacity-70">Reconectando...</div> : null}
        </motion.div>
      </div>

      {status === "error" ? (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="font-semibold">Falha ao carregar</div>
          <div className="mt-1 text-sm opacity-80">{error ?? "Erro desconhecido"}</div>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-lg font-semibold">Ademicon (Vault)</div>
          <div className="mt-1 text-sm opacity-70">
            Biblioteca SSOT em disco. Clique para abrir a fonte oficial.
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:bg-white/10" href="/vault/ademicon/states">
              Estados (SSOT)
            </Link>
            <Link className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:bg-white/10" href="/vault/ademicon/manifesto">
              Manifesto (README)
            </Link>
            <Link className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:bg-white/10" href="/vault/ademicon/doctrine-wealth">
              Doutrina Wealth
            </Link>
            <Link className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:bg-white/10" href="/vault/ademicon/risk-policy">
              Policy de Risco
            </Link>
            <Link className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:bg-white/10" href="/vault/ademicon/dashboard-spec">
              Dashboard Spec
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-lg font-semibold">Projetos</div>
          {projectsNotice ? (
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
              <div className="font-medium">Projetos indisponíveis</div>
              <div className="opacity-80">
                {projectsNotice.message} <span className="opacity-70">({projectsNotice.code})</span>
              </div>
            </div>
          ) : null}
          <div className="mt-3 space-y-2">
            {projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <div className="text-sm font-medium">{p.codeName}</div>
                <div className="text-xs opacity-70">
                  {p.biologicalStatus} • {p.owner} • {p.techStack.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <GanttGrid tasks={tasks} notice={tasksNotice} />
      </div>
    </main>
  );
}
