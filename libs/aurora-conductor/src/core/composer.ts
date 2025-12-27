import { loadContext } from "./context-loader.js";
import { SafeFileSystem } from "./file-system.js";
import { checkPolicy } from "../trustware/policy-checker.js";
import { RunArtifactSchema, type RunArtifact } from "../trustware/schemas.js";

function renderPlanTemplate(template: string, spec: string, sources: string): string {
  return template.replace("{{SPEC}}", spec).replace("{{SOURCES}}", sources);
}

export interface ComposeOptions {
  repoRoot: string;
  dryRun: boolean;
}

export async function compose(spec: string, opts: ComposeOptions): Promise<RunArtifact> {
  const ctx = await loadContext(opts.repoRoot);

  const fs = new SafeFileSystem({
    repoRoot: opts.repoRoot,
    scopeDir: "libs/aurora-conductor",
    allowedWritePrefixes: [".artifacts"]
  });

  const planTemplateRel = "libs/aurora-conductor/src/templates/plan-template.md";
  const planTemplate = await fs.readText(planTemplateRel);

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

  if (opts.dryRun) {
    const outRel = "libs/aurora-conductor/.artifacts/last-run.json";
    await fs.writeText(outRel, JSON.stringify(artifact, null, 2));
    return artifact;
  }

  throw new Error("Non-dryRun não implementado nesta fase. Use dryRun=true.");
}
