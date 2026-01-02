import fs from "fs";
import path from "path";
import matter from "gray-matter";

type ChronosContentItem = {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
  tags: string[];
  path: string;
};

type VaultItem = {
  id: string;
  title: string;
  path: string;
};

type IndexManifest = {
  generatedAt: string;
  roots: {
    chronosContent: string;
    vaultAdemicon: string;
  };
  chronos: ChronosContentItem[];
  vault: VaultItem[];
};

const VAULT_ADEMICON_DOCS: VaultItem[] = [
  {
    id: "VAULT-ADEMICON-README",
    title: "Vault Ademicon (SSOT)",
    path: "README.md",
  },
  {
    id: "VAULT-ADEMICON-DOCTRINE",
    title: "Doutrina Aurora Wealth (Ademicon)",
    path: "00_MANIFESTO/DOCTRINE_WEALTH.md",
  },
  {
    id: "VAULT-ADEMICON-STATES",
    title: "SSOT — Estados (Ademicon)",
    path: "01_STATES/SSOT_STATES.md",
  },
  {
    id: "VAULT-ADEMICON-RISK",
    title: "Policy — Risco Operacional",
    path: "03_POLICIES/risk_policy.md",
  },
  {
    id: "VAULT-ADEMICON-DASHBOARD",
    title: "Dashboard — Wireframe Spec",
    path: "04_DASHBOARD/wireframe_spec.md",
  },
];

function resolveRepoRootFromCwd(): string {
  let current = process.cwd();
  for (;;) {
    const gitDir = path.join(current, ".git");
    if (fs.existsSync(gitDir) && fs.statSync(gitDir).isDirectory()) return current;

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return path.resolve(process.cwd(), "..", "..");
}

function ensureDir(dirPath: string, label: string): void {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(`[chronos:index] ${label} nao encontrado: ${dirPath}`);
  }
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

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag) => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean);
}

function readChronosContent(contentRoot: string): ChronosContentItem[] {
  const items: ChronosContentItem[] = [];
  const files = getAllFiles(contentRoot).filter((file) => file.endsWith(".md"));

  for (const file of files) {
    const relPath = path.relative(contentRoot, file);
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);

    items.push({
      id: String((data as any)?.id ?? ""),
      type: String((data as any)?.type ?? ""),
      title: String((data as any)?.title ?? ""),
      date: String((data as any)?.date ?? ""),
      status: String((data as any)?.status ?? ""),
      tags: normalizeTags((data as any)?.tags),
      path: relPath.replace(/\\/g, "/"),
    });
  }

  return items.sort((a, b) => a.path.localeCompare(b.path));
}

function buildIndex(): IndexManifest {
  const repoRoot = resolveRepoRootFromCwd();
  const chronosContentRoot = path.join(repoRoot, "libs/aurora-chronos/content");
  const vaultAdemiconRoot = path.join(repoRoot, "apps/ozzmosis/data/vault/ademicon");

  ensureDir(chronosContentRoot, "chronos/content");
  ensureDir(vaultAdemiconRoot, "vault/ademicon");

  return {
    generatedAt: new Date().toISOString(),
    roots: {
      chronosContent: "libs/aurora-chronos/content",
      vaultAdemicon: "apps/ozzmosis/data/vault/ademicon",
    },
    chronos: readChronosContent(chronosContentRoot),
    vault: VAULT_ADEMICON_DOCS.map((item) => ({
      ...item,
      path: item.path.replace(/\\/g, "/"),
    })),
  };
}

function writeIndex(index: IndexManifest): void {
  const repoRoot = resolveRepoRootFromCwd();
  const outputPath = path.join(repoRoot, "libs/aurora-chronos/content/index.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(`[chronos:index] index gerado: ${outputPath}`);
}

writeIndex(buildIndex());
