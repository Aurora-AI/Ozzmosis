import { z } from "zod";

export const ContentTypeSchema = z.enum([
  "decision",
  "study",
  "analysis",
  "inventory",
  "project",
  "phase",
]);

export const StatusSchema = z.enum(["active", "planned", "deprecated"]);

export const FrontmatterSchema = z.object({
  id: z
    .string()
    .regex(
      /^(?:(DEC|STD|ANL)-\d{8}-\d{3}|(SVC|PRD)-[A-Z0-9-]+)$/,
      "ID fora do padrão canônico (DEC/STD/ANL-YYYYMMDD-XXX ou SVC/PRD-NOME)"
    ),
  type: ContentTypeSchema,
  title: z.string().min(5).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve ser YYYY-MM-DD"),
  status: StatusSchema,
  tags: z.array(z.string()),
  related: z
    .object({
      projects: z.array(z.string()).optional(),
      services: z.array(z.string()).optional(),
    })
    .optional(),
  source: z
    .object({
      kind: z.string().optional(),
      tool: z.string().optional(),
      drive: z
        .object({
          fileId: z.string().optional(),
          name: z.string().optional(),
          origin: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});
