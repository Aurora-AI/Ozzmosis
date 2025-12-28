import { ProjectListSchema, TaskListSchema } from "@aurora/trustware";

export type ShieldErrorCode = "shield_missing" | "shield_timeout" | "shield_http_5xx" | "shield_http_4xx" | "unknown";

export type Projects = ReturnType<typeof ProjectListSchema.parse>;
export type Tasks = ReturnType<typeof TaskListSchema.parse>;

export type ProjectsResult =
  | { ok: true; projects: Projects }
  | { ok: false; code: ShieldErrorCode; message: string; projects: Projects; status?: number };

export type TasksResult =
  | { ok: true; tasks: Tasks }
  | { ok: false; code: ShieldErrorCode; message: string; tasks: Tasks; status?: number };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

async function readJsonSafe(res: Response): Promise<unknown | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function unknownFailure(message: string) {
  return { ok: false as const, code: "unknown" as const, message };
}

export async function fetchProjects(): Promise<ProjectsResult> {
  try {
    const res = await fetch("/api/projects", { cache: "no-store" });
    const json = await readJsonSafe(res);

    if (isRecord(json) && json.ok === true) {
      const projects = ProjectListSchema.parse(json.projects);
      return { ok: true, projects };
    }

    if (isRecord(json) && json.ok === false) {
      return {
        ok: false,
        code: (typeof json.code === "string" ? (json.code as ShieldErrorCode) : "unknown") satisfies ShieldErrorCode,
        message: typeof json.message === "string" ? json.message : `projects_http_${res.status}`,
        projects: [],
        status: res.status
      };
    }

    if (!res.ok) {
      return { ok: false, code: "unknown", message: `projects_http_${res.status}`, projects: [], status: res.status };
    }

    return { ...unknownFailure("Resposta inválida de /api/projects"), projects: [] };
  } catch (e) {
    return { ...unknownFailure(e instanceof Error ? e.message : String(e)), projects: [] };
  }
}

export async function fetchTasks(): Promise<TasksResult> {
  try {
    const res = await fetch("/api/tasks", { cache: "no-store" });
    const json = await readJsonSafe(res);

    if (isRecord(json) && json.ok === true) {
      const tasks = TaskListSchema.parse(json.tasks);
      return { ok: true, tasks };
    }

    if (isRecord(json) && json.ok === false) {
      return {
        ok: false,
        code: (typeof json.code === "string" ? (json.code as ShieldErrorCode) : "unknown") satisfies ShieldErrorCode,
        message: typeof json.message === "string" ? json.message : `tasks_http_${res.status}`,
        tasks: [],
        status: res.status
      };
    }

    if (!res.ok) {
      return { ok: false, code: "unknown", message: `tasks_http_${res.status}`, tasks: [], status: res.status };
    }

    return { ...unknownFailure("Resposta inválida de /api/tasks"), tasks: [] };
  } catch (e) {
    return { ...unknownFailure(e instanceof Error ? e.message : String(e)), tasks: [] };
  }
}
