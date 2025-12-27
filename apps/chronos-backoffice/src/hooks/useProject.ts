"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project, Task } from "@aurora/trustware";
import { fetchProjects, fetchTasks } from "@/lib/api";
import { tryReflectRetry } from "@/lib/retry";

type Status = "loading" | "ready" | "error";

export function useProject() {
  const [status, setStatus] = useState<Status>("loading");
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setStatus("loading");
      setError(null);

      try {
        setRetrying(false);

        const [p, t] = await tryReflectRetry({
          organ: "chronos",
          action: "fetch_projects_and_tasks",
          attemptLimit: 3,
          baseDelayMs: 250,
          fn: async (attempt) => {
            if (attempt > 1 && alive) setRetrying(true);
            const [pRes, tRes] = await Promise.all([fetchProjects(), fetchTasks()]);
            return [pRes, tRes] as const;
          }
        });

        if (!alive) return;
        setProjects(p);
        setTasks(t);
        setRetrying(false);
        setStatus("ready");
      } catch (e) {
        if (!alive) return;
        setRetrying(false);
        setStatus("error");
        setError(e instanceof Error ? e.message : String(e));
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const mappedTasks = useMemo(
    () =>
      tasks.map((t) => ({
        id: t.id,
        title: t.title,
        effort: t.effort,
        dependencies: t.dependencies
      })),
    [tasks]
  );

  return { status, retrying, error, projects, tasks: mappedTasks };
}
