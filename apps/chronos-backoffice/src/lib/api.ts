import { ProjectListSchema, TaskListSchema } from "@aurora/trustware";

export async function fetchProjects(): Promise<ReturnType<typeof ProjectListSchema.parse>> {
  const res = await fetch("/api/projects", { cache: "no-store" });
  if (!res.ok) throw new Error(`projects_http_${res.status}`);
  return ProjectListSchema.parse(await res.json());
}

export async function fetchTasks(): Promise<ReturnType<typeof TaskListSchema.parse>> {
  const res = await fetch("/api/tasks", { cache: "no-store" });
  if (!res.ok) throw new Error(`tasks_http_${res.status}`);
  return TaskListSchema.parse(await res.json());
}
