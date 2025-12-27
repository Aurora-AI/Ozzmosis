import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { AuroraConfig } from "./config-loader.js";

export type ContextSourceKind =
  | "constitution"
  | "manual"
  | "product"
  | "techstack";

export interface ContextSource {
  path: string;
  kind: ContextSourceKind;
}

export interface LoadedContext {
  constitutionText: string;
  manualText?: string;
  productText?: string;
  techstackText?: string;
  sources: ContextSource[];
}

export interface LoadContextOptions {
  config?: AuroraConfig;
  logger?: Pick<Console, "warn">;
}

const CANDIDATE_PATHS: Array<{ kind: ContextSourceKind; candidates: string[] }> = [
  {
    kind: "constitution",
    candidates: [
      "Instruções Projeto Aurora.txt",
      "Instrucoes Projeto Aurora.txt",
      "INSTRUCOES_PROJETO_AURORA.txt",
      "docs/Instruções Projeto Aurora.txt",
      "docs/Instrucoes Projeto Aurora.txt",
      "docs/INSTRUCOES_PROJETO_AURORA.txt",
      "CONSTITUICAO/Instruções Projeto Aurora.txt",
      "CONSTITUICAO/Instrucoes Projeto Aurora.txt"
    ]
  },
  {
    kind: "manual",
    candidates: [
      "Manual_de_Construcao_Aurora_v4.0.txt",
      "Manual de Construção Aurora v3.3.txt",
      "Manual de Construção Aurora v3.2.txt",
      "docs/Manual_de_Construcao_Aurora_v4.0.txt",
      "docs/Manual de Construção Aurora v3.3.txt"
    ]
  },
  { kind: "product", candidates: ["product.md", "docs/product.md"] },
  { kind: "techstack", candidates: ["techstack.md", "docs/techstack.md"] }
];

async function readIfExists(repoRoot: string, rel: string): Promise<string | undefined> {
  const abs = path.resolve(repoRoot, rel);
  if (!existsSync(abs)) return undefined;
  return readFile(abs, "utf8");
}

export async function loadContext(repoRoot: string, opts: LoadContextOptions = {}): Promise<LoadedContext> {
  const logger = opts.logger ?? console;
  const sources: ContextSource[] = [];

  const constitutionRel =
    opts.config?.docs.constitutionPath && existsSync(path.resolve(repoRoot, opts.config.docs.constitutionPath))
      ? opts.config.docs.constitutionPath
      : CANDIDATE_PATHS.find((x) => x.kind === "constitution")!.candidates.find((p) =>
          existsSync(path.resolve(repoRoot, p))
        );

  const constitutionText = constitutionRel ? (await readIfExists(repoRoot, constitutionRel)) ?? "" : "";
  if (constitutionRel && constitutionText) {
    sources.push({ path: constitutionRel, kind: "constitution" });
  } else {
    logger.warn(
      [
        "Constituição não encontrada (modo resiliente).",
        "Esperado: 'Instruções Projeto Aurora.txt' na raiz (ou docs/ ou CONSTITUICAO/).",
        "Continuando com contexto mínimo."
      ].join(" ")
    );
  }

  const manualRel =
    opts.config?.docs.manualPath && existsSync(path.resolve(repoRoot, opts.config.docs.manualPath))
      ? opts.config.docs.manualPath
      : CANDIDATE_PATHS.find((x) => x.kind === "manual")!.candidates.find((p) =>
          existsSync(path.resolve(repoRoot, p))
        );

  const manualText = manualRel ? await readIfExists(repoRoot, manualRel) : undefined;
  if (manualRel && manualText) sources.push({ path: manualRel, kind: "manual" });
  if (opts.config?.docs.manualPath && manualRel !== opts.config.docs.manualPath) {
    logger.warn(`manual não encontrado em '${opts.config.docs.manualPath}' (warn-only)`);
  }

  const productRel = CANDIDATE_PATHS.find((x) => x.kind === "product")!.candidates
    .find((p) => existsSync(path.resolve(repoRoot, p)));

  const productText = productRel ? await readIfExists(repoRoot, productRel) : undefined;
  if (productRel && productText) sources.push({ path: productRel, kind: "product" });

  const techstackRel = CANDIDATE_PATHS.find((x) => x.kind === "techstack")!.candidates
    .find((p) => existsSync(path.resolve(repoRoot, p)));

  const techstackText = techstackRel ? await readIfExists(repoRoot, techstackRel) : undefined;
  if (techstackRel && techstackText) sources.push({ path: techstackRel, kind: "techstack" });

  const result: LoadedContext = { constitutionText, sources };
  if (manualText !== undefined) result.manualText = manualText;
  if (productText !== undefined) result.productText = productText;
  if (techstackText !== undefined) result.techstackText = techstackText;
  return result;
}
