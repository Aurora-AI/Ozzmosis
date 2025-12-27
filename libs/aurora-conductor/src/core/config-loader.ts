import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

export const AuroraConfigSchema = z.object({
  version: z.number().int().positive().default(1),
  policy: z
    .object({
      mode: z.enum(["warn", "error"]).default("warn")
    })
    .default({ mode: "warn" }),
  docs: z
    .object({
      manualPath: z.string().min(1).optional(),
      constitutionPath: z.string().min(1).optional()
    })
    .default({})
});

export type AuroraConfig = z.infer<typeof AuroraConfigSchema>;

export interface LoadConfigOptions {
  logger?: Pick<Console, "warn">;
  configFileName?: string;
}

function formatZodIssues(issues: z.ZodIssue[]): string {
  const parts = issues.map((i) => {
    const at = i.path.length ? ` at ${i.path.join(".")}` : "";
    return `${i.message}${at}`;
  });
  return parts.join("; ");
}

export async function loadConfig(repoRoot: string, opts: LoadConfigOptions = {}): Promise<AuroraConfig> {
  const logger = opts.logger ?? console;
  const configFileName = opts.configFileName ?? "aurora.config.json";

  const configAbs = path.resolve(repoRoot, configFileName);
  if (!existsSync(configAbs)) {
    logger.warn(`aurora.config: '${configFileName}' não encontrado; usando defaults resilientes.`);
    return AuroraConfigSchema.parse({});
  }

  let rawText: string;
  try {
    rawText = await readFile(configAbs, "utf8");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`aurora.config: falha ao ler '${configFileName}': ${msg}`);
  }

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(rawText);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`aurora.config: JSON inválido em '${configFileName}': ${msg}`);
  }

  const parsed = AuroraConfigSchema.safeParse(rawJson);
  if (!parsed.success) {
    throw new Error(`aurora.config: schema inválido em '${configFileName}': ${formatZodIssues(parsed.error.issues)}`);
  }

  const cfg = parsed.data;

  if (cfg.docs.manualPath) {
    const manualAbs = path.resolve(repoRoot, cfg.docs.manualPath);
    if (!existsSync(manualAbs)) {
      logger.warn(
        `aurora.config: manualPath aponta para arquivo inexistente: ${cfg.docs.manualPath} (warn-only)`
      );
    }
  }

  if (cfg.docs.constitutionPath) {
    const constitutionAbs = path.resolve(repoRoot, cfg.docs.constitutionPath);
    if (!existsSync(constitutionAbs)) {
      logger.warn(
        `aurora.config: constitutionPath aponta para arquivo inexistente: ${cfg.docs.constitutionPath} (warn-only)`
      );
    }
  }

  return cfg;
}

