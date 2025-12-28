import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { FrontmatterSchema } from "./guard-schema";

// Regex atômica e completa: detecta [cite_start] e [cite: X]
const FORBIDDEN_REGEX = /\[cite_start\]|\[cite:[^\]]+\]/;

function resolveRepoRootFromCwd(): string {
  let current = process.cwd();
  for (;;) {
    const gitDir = path.join(current, ".git");
    if (fs.existsSync(gitDir) && fs.statSync(gitDir).isDirectory()) return current;

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  // Fallback: assume monorepo layout libs/aurora-chronos
  return path.resolve(process.cwd(), "..", "..");
}

function resolveContentRoot(): string {
  const repoRoot = resolveRepoRootFromCwd();

  // Candidatos em ordem de prioridade (ajuste fino baseado na estrutura real do repo)
  const candidates = [
    path.join(repoRoot, "libs/aurora-chronos/chronos/content"),
    path.join(repoRoot, "libs/aurora-chronos/content"),
    path.join(repoRoot, "apps/chronos-backoffice/chronos/content"), // fallback se existir no futuro
    path.join(repoRoot, "chronos/content"), // fallback genérico
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c;
  }

  const msg =
    "❌ Chronos Guard: não foi possível localizar o diretório de conteúdo.\n" +
    "Caminhos verificados:\n" +
    candidates.map((c) => `- ${c}`).join("\n") +
    "\n\nAção: ajuste resolveContentRoot() para o caminho real do conteúdo no repo.";
  throw new Error(msg);
}

function validatePathType(type: string, relPath: string): boolean {
  // Estrutura esperada relativa ao content root:
  // library/decisions/*.md -> decision
  // library/studies/*.md -> study
  // library/analyses/*.md -> analysis
  // planner/projects/*.md -> project
  // planner/phases/*.md -> phase
  // inventory/services/*.md -> inventory
  // inventory/products/*.md -> inventory

  const parts = relPath.split(path.sep);
  const folder = parts[0];
  const sub = parts[1];

  const ok: Record<string, boolean> = {
    decision: folder === "library" && sub === "decisions",
    study: folder === "library" && sub === "studies",
    analysis: folder === "library" && sub === "analyses",
    project: folder === "planner" && sub === "projects",
    phase: folder === "planner" && sub === "phases",
    inventory:
      folder === "inventory" && (sub === "services" || sub === "products"),
  };

  return ok[type] || false;
}

function getAllFiles(dirPath: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const full = path.join(dirPath, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) getAllFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

async function runGuard() {
  console.log("🚀 Chronos Guard: Iniciando varredura de integridade...");

  let contentRoot: string;
  try {
    contentRoot = resolveContentRoot();
  } catch (e: any) {
    console.error(String(e?.message || e));
    process.exit(1);
  }

  const files = getAllFiles(contentRoot).filter((f) => f.endsWith(".md"));
  let errors = 0;
  const ids = new Set<string>();

  for (const file of files) {
    const relPath = path.relative(contentRoot, file);
    const raw = fs.readFileSync(file, "utf8");

    if (!raw.startsWith("---")) {
      console.error(`❌ [NO FRONTMATTER] ${relPath}`);
      errors++;
      continue;
    }

    const { data, content: body } = matter(raw);

    // 1) Frontmatter schema
    const parsed = FrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      console.error(
        `❌ [FRONTMATTER] ${relPath}:`,
        JSON.stringify(parsed.error.format(), null, 2)
      );
      errors++;
    }

    // 2) Unicidade de ID
    const id = String((data as any)?.id || "");
    if (id) {
      if (ids.has(id)) {
        console.error(`❌ [DUPLICATE ID] ${id} em ${relPath}`);
        errors++;
      } else {
        ids.add(id);
      }
    }

    // 3) Tipo vs caminho
    const type = String((data as any)?.type || "");
    if (!validatePathType(type, relPath)) {
      console.error(`❌ [PATH MISMATCH] type='${type}' inválido para '${relPath}'`);
      errors++;
    }

    // 4) Resíduos proibidos
    if (FORBIDDEN_REGEX.test(body)) {
      console.error(`❌ [FORBIDDEN RESIDUE] Encontrado em ${relPath}`);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`\n🛑 Guard: ${errors} falhas encontradas. Bloqueando integração.`);
    process.exit(1);
  }

  console.log("\n✅ Chronos Guard: Inviolabilidade editorial confirmada.");
  process.exit(0);
}

runGuard();
