import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..");

const mustExistFiles = [
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  "package-lock.json",
  "docs/CONTRACT.md",
  "docs/CONSTITUICAO/README.md",
  "docs/CONSTITUICAO/PROCESSO_PRODUTIVO.md",
  "docs/CONSTITUICAO/CHECKLIST_FABRICA.md",
  "docs/Vault_SSoT_MANIFEST.md",
  "agent-skills/README.md"
];

const required = [
  ...mustExistFiles
];

const missing = required.filter((relativePath) =>
  !fs.existsSync(path.join(repoRoot, relativePath))
);

if (missing.length) {
  console.error("[repo-contract] Missing required files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const rootPackageJsonPath = path.join(repoRoot, "package.json");
const rootPackageJson = JSON.parse(
  fs.readFileSync(rootPackageJsonPath, "utf8")
);

const requiredRootScripts = [
  "build:conductor",
  "typecheck:conductor",
  "lint:conductor",
  "smoke:conductor",
  "survival:conductor",
  "repo:check",
  "repo:clean",
  "install:clean"
];

const missingScripts = requiredRootScripts.filter(
  (scriptName) => !(rootPackageJson.scripts && rootPackageJson.scripts[scriptName])
);

if (missingScripts.length) {
  console.error("[repo-contract] Missing required root scripts:");
  for (const scriptName of missingScripts) console.error(`- ${scriptName}`);
  process.exit(1);
}

const scriptValue = (name) => String(rootPackageJson.scripts[name] ?? "");

const isToolingInvoked = (value) =>
  value.includes("@aurora/tooling") || value.includes("packages/tooling");

for (const name of ["repo:check", "repo:clean"]) {
  const value = scriptValue(name);
  if (!isToolingInvoked(value)) {
    console.error(
      `[repo-contract] Root script '${name}' must invoke @aurora/tooling (workspace) or packages/tooling (prefix).`
    );
    console.error(`[repo-contract] Current value: ${JSON.stringify(value)}`);
    process.exit(1);
  }
}

const workspaceList = Array.isArray(rootPackageJson.workspaces)
  ? rootPackageJson.workspaces
  : [];
const requiredWorkspaces = ["apps/*", "libs/*", "packages/*"];
const missingWorkspaces = requiredWorkspaces.filter(
  (w) => !workspaceList.includes(w)
);

if (missingWorkspaces.length) {
  console.error("[repo-contract] Missing required workspaces:");
  for (const w of missingWorkspaces) console.error(`- ${w}`);
  process.exit(1);
}

let trackedFiles;
try {
  trackedFiles = execFileSync("git", ["ls-files"], {
    cwd: repoRoot,
    encoding: "utf8"
  })
    .split(/\r?\n/u)
    .filter(Boolean);
} catch (error) {
  console.error("[repo-contract] git is required and repo must be a git checkout.");
  console.error(error?.stderr?.toString?.() ?? error);
  process.exit(1);
}

const forbiddenTrackedMatchers = [
  { name: "node_modules", match: (p) => p === "node_modules" || p.startsWith("node_modules/") },
  { name: ".artifacts", match: (p) => p === ".artifacts" || p.startsWith(".artifacts/") },
  { name: ".next", match: (p) => p === ".next" || p.startsWith(".next/") },
  { name: ".turbo", match: (p) => p === ".turbo" || p.startsWith(".turbo/") },
  { name: "dist", match: (p) => p === "dist" || p.startsWith("dist/") || p.includes("/dist/") },
  { name: "build", match: (p) => p === "build" || p.startsWith("build/") || p.includes("/build/") },
  { name: "last-run.json", match: (p) => p === "last-run.json" || p.endsWith("/last-run.json") },
  { name: "npm-debug.log", match: (p) => /(^|\/)npm-debug\.log(\..*)?$/u.test(p) }
];

const forbiddenTracked = [];
for (const filePath of trackedFiles) {
  for (const rule of forbiddenTrackedMatchers) {
    if (rule.match(filePath)) forbiddenTracked.push(filePath);
  }
}

if (forbiddenTracked.length) {
  const unique = Array.from(new Set(forbiddenTracked)).sort();
  console.error("[repo-contract] Forbidden files are tracked in git:");
  for (const filePath of unique) console.error(`- ${filePath}`);
  process.exit(1);
}

if (!trackedFiles.includes("package-lock.json")) {
  console.error("[repo-contract] package-lock.json must be tracked at repo root.");
  process.exit(1);
}

let visibleFiles;
try {
  visibleFiles = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], {
    cwd: repoRoot,
    encoding: "utf8"
  })
    .split(/\r?\n/u)
    .filter(Boolean);
} catch (error) {
  console.error("[repo-contract] git is required and repo must be a git checkout.");
  console.error(error?.stderr?.toString?.() ?? error);
  process.exit(1);
}

const lockfiles = visibleFiles
  .filter(
    (p) =>
      p === "package-lock.json" ||
      p.endsWith("/package-lock.json") ||
      p === "npm-shrinkwrap.json" ||
      p.endsWith("/npm-shrinkwrap.json") ||
      p.endsWith("yarn.lock") ||
      p.endsWith("pnpm-lock.yaml") ||
      p === ".npmrc" ||
      p.endsWith("/.npmrc")
  )
  .sort();

const forbiddenLockfiles = lockfiles.filter((p) => p !== "package-lock.json");

if (forbiddenLockfiles.length) {
  console.error(
    "[repo-contract] Forbidden lockfiles present (root lockfile only):"
  );
  for (const filePath of forbiddenLockfiles) console.error(`- ${filePath}`);
  process.exit(1);
}

console.log("[repo-contract] OK");
