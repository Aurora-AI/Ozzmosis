// libs/trustware/src/chronos.ts

/**
 * Contratos públicos usados pelo Chronos Backoffice.
 * Nota: este módulo define apenas o necessário para compilar e validar payloads.
 */

import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  codeName: z.string(),
  biologicalStatus: z.string(),
  techStack: z.array(z.string()),
  repositoryUrl: z.string().optional(),
  owner: z.string(),
  lastVitalSign: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  done: z.boolean().default(false),
  effort: z.number(),
  dependencies: z.array(z.string()),
  assignee: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export const ProjectListSchema = z.array(ProjectSchema);
export const TaskListSchema = z.array(TaskSchema);
