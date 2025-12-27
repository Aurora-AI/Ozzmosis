import { z } from "zod";

export const PolicyViolationSchema = z.object({
  code: z.string(),
  message: z.string()
});

export const PolicyResultSchema = z.object({
  pass: z.boolean(),
  violations: z.array(PolicyViolationSchema)
});

export const RunArtifactSchema = z.object({
  spec: z.string(),
  sources: z.array(z.object({ path: z.string(), kind: z.string() })),
  plan: z.string(),
  policy: PolicyResultSchema,
  proposedFileChanges: z.array(
    z.object({
      path: z.string(),
      action: z.enum(["create", "update", "delete"]),
      reason: z.string()
    })
  )
});

export type PolicyResult = z.infer<typeof PolicyResultSchema>;
export type RunArtifact = z.infer<typeof RunArtifactSchema>;
