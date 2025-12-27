import { ProjectListSchema, TaskListSchema } from "@aurora/trustware";
import { logEvent } from "./log";

type FetchMode = "dev_local" | "shield";

function getMode(): FetchMode {
  const env = process.env.NEXT_PUBLIC_CHRONOS_MODE;
  if (env === "shield" || env === "dev_local") return env;
  return process.env.NODE_ENV === "production" ? "shield" : "dev_local";
}

function required(name: string, v?: string) {
  if (!v) throw new Error(`missing_env_${name}`);
  return v;
}

export async function fetchProjects(): Promise<ReturnType<typeof ProjectListSchema.parse>> {
  const mode = getMode();

  if (mode === "dev_local") {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (!res.ok) throw new Error(`projects_http_${res.status}`);
    return ProjectListSchema.parse(await res.json());
  }

  const shieldUrl = required("SHIELD_URL", process.env.NEXT_PUBLIC_SHIELD_URL ?? process.env.SHIELD_URL);
  const token = required("SHIELD_TOKEN", process.env.SHIELD_TOKEN);

  const res = await fetch(`${shieldUrl}/proxy/projects`, {
    cache: "no-store",
    headers: { "X-Organ": "chronos", "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    logEvent({ organ: "chronos", action: "fetch_projects_shield", status: "failure", meta: { http: res.status } });
    throw new Error(`projects_shield_http_${res.status}`);
  }

  return ProjectListSchema.parse(await res.json());
}

export async function fetchTasks(): Promise<ReturnType<typeof TaskListSchema.parse>> {
  const mode = getMode();

  if (mode === "dev_local") {
    const res = await fetch("/api/tasks", { cache: "no-store" });
    if (!res.ok) throw new Error(`tasks_http_${res.status}`);
    return TaskListSchema.parse(await res.json());
  }

  const shieldUrl = required("SHIELD_URL", process.env.NEXT_PUBLIC_SHIELD_URL ?? process.env.SHIELD_URL);
  const token = required("SHIELD_TOKEN", process.env.SHIELD_TOKEN);

  const res = await fetch(`${shieldUrl}/proxy/tasks`, {
    cache: "no-store",
    headers: { "X-Organ": "chronos", "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    logEvent({ organ: "chronos", action: "fetch_tasks_shield", status: "failure", meta: { http: res.status } });
    throw new Error(`tasks_shield_http_${res.status}`);
  }

  return TaskListSchema.parse(await res.json());
}
