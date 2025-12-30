import { z } from 'zod';

export const ComposeRequestSchema = z.object({
  // Identificador lógico do “build”/artefato
  id: z.string().min(3).max(120),
  // Caminho relativo do plano/entrada (ex.: chronos content / decision files / templates)
  input: z.object({
    kind: z.enum(['chronos', 'inline']),
    // quando kind=chronos
    chronosRef: z.string().optional(),
    // quando kind=inline
    inline: z.string().optional()
  }),
  // Modo de policy (error = hard block)
  policy: z
    .object({
      mode: z.enum(['error', 'warn']).default('error')
    })
    .default({ mode: 'error' })
});

export type ComposeRequest = z.infer<typeof ComposeRequestSchema>;

export const ComposeResponseSchema = z.object({
  ok: z.boolean(),
  code: z.string().optional(),
  message: z.string().optional(),
  artifactId: z.string().optional(),
  artifactPath: z.string().optional()
});

export type ComposeResponse = z.infer<typeof ComposeResponseSchema>;
