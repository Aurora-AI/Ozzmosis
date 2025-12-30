import { z } from 'zod';

const EnvSchema = z.object({
  CONDUCTOR_PORT: z.coerce.number().default(4101),
  CONDUCTOR_TOKEN: z.string().min(8).default('local-dev-conductor-token'),
  CONDUCTOR_ARTIFACT_DIR: z.string().default('./data/artifacts'),
  NODE_ENV: z.string().optional()
});

export type ConductorEnv = z.infer<typeof EnvSchema>;

export function loadEnv(): ConductorEnv {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Não logar env inteiro; só erro estruturado
    throw new Error(`Invalid env: ${JSON.stringify(parsed.error.format())}`);
  }
  return parsed.data;
}
