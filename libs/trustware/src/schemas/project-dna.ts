import { z } from "zod";

export const BiologicalStatusSchema = z.enum(["EMBRIAO", "VIVO", "HIBERNANDO", "NECROSE"]);

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  codeName: z.string().min(3).max(50),
  biologicalStatus: BiologicalStatusSchema,
  techStack: z.array(z.string()),
  repositoryUrl: z.string().url(),
  owner: z.string().email(),
  lastVitalSign: z
    .string()
    .datetime({ offset: true })
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), { message: "Sinal vital inválido (Data corrompida)" })
});

export const TaskSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string().min(1).max(120),
  effort: z.number().min(1).max(100),
  dependencies: z.array(z.string().uuid()),
  assignee: z.string().email().optional()
});

export type Project = z.infer<typeof ProjectSchema>;
export type Task = z.infer<typeof TaskSchema>;

export const ProjectListSchema = z.array(ProjectSchema);
export const TaskListSchema = z.array(TaskSchema);

export const BiologicalTransitions = {
  EMBRIAO: ["VIVO", "NECROSE"],
  VIVO: ["HIBERNANDO", "NECROSE"],
  HIBERNANDO: ["VIVO", "NECROSE"],
  NECROSE: []
} as const;

export function canTransition(
  from: z.infer<typeof BiologicalStatusSchema>,
  to: z.infer<typeof BiologicalStatusSchema>
) {
  return (BiologicalTransitions[from] as readonly string[]).includes(to);
}
