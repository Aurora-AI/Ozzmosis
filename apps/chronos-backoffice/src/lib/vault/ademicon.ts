import fs from "fs";
import path from "path";

export type AdemiconVaultDoc = {
  slug: string;
  title: string;
  relativePath: string;
};

const ADEMICON_DOCS: AdemiconVaultDoc[] = [
  {
    slug: "manifesto",
    title: "Manifesto (README)",
    relativePath: "README.md",
  },
  {
    slug: "doctrine-wealth",
    title: "Doutrina Wealth",
    relativePath: "00_MANIFESTO/DOCTRINE_WEALTH.md",
  },
  {
    slug: "states",
    title: "Estados SSOT",
    relativePath: "01_STATES/SSOT_STATES.md",
  },
  {
    slug: "risk-policy",
    title: "Policy de Risco",
    relativePath: "03_POLICIES/risk_policy.md",
  },
  {
    slug: "dashboard-spec",
    title: "Dashboard Spec",
    relativePath: "04_DASHBOARD/wireframe_spec.md",
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

export function getAdemiconVaultRoot(): string {
  const repoRoot = resolveRepoRootFromCwd();
  return path.join(repoRoot, "apps/ozzmosis/data/vault/ademicon");
}

export function listAdemiconVaultDocs(): AdemiconVaultDoc[] {
  return [...ADEMICON_DOCS];
}

export function readAdemiconVaultDoc(slug: string): { doc: AdemiconVaultDoc; content: string } | null {
  const doc = ADEMICON_DOCS.find((item) => item.slug === slug);
  if (!doc) return null;

  const vaultRoot = getAdemiconVaultRoot();
  const fullPath = path.join(vaultRoot, doc.relativePath);
  if (!fs.existsSync(fullPath)) return null;

  const content = fs.readFileSync(fullPath, "utf8");
  return { doc, content };
}
