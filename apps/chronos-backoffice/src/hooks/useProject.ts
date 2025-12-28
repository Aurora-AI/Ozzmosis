"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project, Task } from "@aurora/trustware";
import { fetchProjects, fetchTasks, type ShieldErrorCode } from "@/lib/api";
import { tryReflectRetry } from "@/lib/retry";

type Status = "loading" | "ready" | "degraded" | "error";
type Notice = { code: ShieldErrorCode; message: string };

function isRetryable(code: ShieldErrorCode) {
  return code === "shield_http_5xx" || code === "unknown";
}

export function useProject() {
  const [status, setStatus] = useState<Status>("loading");
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectsNotice, setProjectsNotice] = useState<Notice | null>(null);
  const [tasksNotice, setTasksNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setStatus("loading");
      setError(null);
      setProjectsNotice(null);
      setTasksNotice(null);

      try {
        setRetrying(false);

        const attemptLimit = 3;
        const [pRes, tRes] = await tryReflectRetry({
          organ: "chronos",
          action: "fetch_projects_and_tasks",
          attemptLimit,
          baseDelayMs: 250,
          fn: async (attempt) => {
            if (attempt > 1 && alive) setRetrying(true);
            const [pRes, tRes] = await Promise.all([fetchProjects(), fetchTasks()]);

            const shouldRetry =
              attempt < attemptLimit &&
              ((!pRes.ok && isRetryable(pRes.code)) || (!tRes.ok && isRetryable(tRes.code)));

            if (shouldRetry) throw new Error("backend_retry");
            return [pRes, tRes] as const;
          }
        });

        if (!alive) return;
        setProjects(pRes.ok ? pRes.projects : []);
        setTasks(tRes.ok ? tRes.tasks : []);
        setProjectsNotice(pRes.ok ? null : { code: pRes.code, message: pRes.message });
        setTasksNotice(tRes.ok ? null : { code: tRes.code, message: tRes.message });
        setRetrying(false);
        setStatus(!pRes.ok || !tRes.ok ? "degraded" : "ready");
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

  return { status, retrying, error, projects, tasks: mappedTasks, projectsNotice, tasksNotice };
}
