"use client";

import React from "react";
import { motion } from "framer-motion";
import type { GanttTask } from "./types";

type Props = { tasks: GanttTask[]; notice?: { code: string; message: string } | null };

export function GanttGrid({ tasks, notice }: Props) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Gantt</div>
          <div className="text-sm opacity-70">Base viva (CSS Grid + Motion)</div>
        </div>
        <div className="text-xs opacity-60">{tasks.length} tasks</div>
      </div>

      {notice ? (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
          <div className="font-medium">Tasks indisponíveis</div>
          <div className="opacity-80">
            {notice.message} <span className="opacity-70">({notice.code})</span>
          </div>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-4 grid gap-2"
        style={{ gridTemplateColumns: "1fr 100px" }}
      >
        <div className="text-xs opacity-70">Tarefa</div>
        <div className="text-xs opacity-70 text-right">Esforço</div>

        {tasks.map((t) => (
          <React.Fragment key={t.id}>
            <motion.div
              initial={{ scale: 0.995 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
              title={t.dependencies.length ? `Deps: ${t.dependencies.join(", ")}` : "Sem dependências"}
            >
              <div className="text-sm font-medium">{t.title}</div>
              <div className="text-xs opacity-60">{t.dependencies.length} dependências</div>
            </motion.div>
            <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-right text-sm">{t.effort}</div>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
