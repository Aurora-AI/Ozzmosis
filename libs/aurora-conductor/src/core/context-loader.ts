import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

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

export async function loadContext(repoRoot: string): Promise<LoadedContext> {
  const sources: ContextSource[] = [];

  const constitutionRel = CANDIDATE_PATHS.find((x) => x.kind === "constitution")!.candidates
    .find((p) => existsSync(path.resolve(repoRoot, p)));

  if (!constitutionRel) {
    throw new Error(
      [
        "Constituição não encontrada.",
        "Esperado: arquivo 'Instruções Projeto Aurora.txt' na raiz do repositório (ou em docs/ ou CONSTITUICAO/).",
        "Adicione o arquivo ao repositório para habilitar o Conductor."
      ].join(" ")
    );
  }

  const constitutionText = (await readIfExists(repoRoot, constitutionRel))!;
  sources.push({ path: constitutionRel, kind: "constitution" });

  const manualRel = CANDIDATE_PATHS.find((x) => x.kind === "manual")!.candidates
    .find((p) => existsSync(path.resolve(repoRoot, p)));

  const manualText = manualRel ? await readIfExists(repoRoot, manualRel) : undefined;
  if (manualRel && manualText) sources.push({ path: manualRel, kind: "manual" });

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
