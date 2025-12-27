import { loadConfig } from "./config-loader.js";
import { loadContext } from "./context-loader.js";
import { SafeFileSystem } from "./file-system.js";
import { checkPolicy } from "../trustware/policy-checker.js";
import { RunArtifactSchema, type RunArtifact } from "../trustware/schemas.js";
import { readFile } from "node:fs/promises";

function renderPlanTemplate(template: string, spec: string, sources: string): string {
  return template.replace("{{SPEC}}", spec).replace("{{SOURCES}}", sources);
}

export interface ComposeOptions {
  repoRoot: string;
  dryRun: boolean;
  writeArtifacts?: boolean;
  artifactsDir?: string;
}

export async function compose(spec: string, opts: ComposeOptions): Promise<RunArtifact> {
  const config = await loadConfig(opts.repoRoot);
  const ctx = await loadContext(opts.repoRoot, { config });

  const planTemplate = await readFile(new URL("../templates/plan-template.md", import.meta.url), "utf8");

  const sourcesStr = ctx.sources.map((s) => `- ${s.kind}: ${s.path}`).join("\n");
  const plan = renderPlanTemplate(planTemplate, spec, sourcesStr);

  const policy = checkPolicy({ plan });

  const artifact: RunArtifact = {
    spec,
    sources: ctx.sources.map((s) => ({ path: s.path, kind: s.kind })),
    plan,
    policy,
    proposedFileChanges: []
  };

  RunArtifactSchema.parse(artifact);

  if (!policy.pass && config.policy.mode === "error") {
    const details = policy.violations.map((v) => `${v.code}: ${v.message}`).join(" | ");
    throw new Error(`Policy failed (mode=ERROR): ${details}`);
  }

  if (opts.dryRun) {
    if (opts.writeArtifacts) {
      const artifactsDir = opts.artifactsDir ?? ".artifacts/aurora-conductor";
      if (!artifactsDir.startsWith(".artifacts")) {
        throw new Error(`artifactsDir inválido (deve iniciar com '.artifacts'): ${artifactsDir}`);
      }

      const fs = new SafeFileSystem({
        repoRoot: opts.repoRoot,
        scopeDir: ".",
        allowedWritePrefixes: [".artifacts"]
      });

      const outRel = `${artifactsDir}/last-run.json`;
      await fs.writeText(outRel, JSON.stringify(artifact, null, 2));
    }
    return artifact;
  }

  throw new Error("Non-dryRun não implementado nesta fase. Use dryRun=true.");
}
