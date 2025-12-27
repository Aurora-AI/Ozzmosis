import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..");

let status;
try {
  status = execFileSync("git", ["status", "--porcelain"], {
    cwd: repoRoot,
    encoding: "utf8"
  }).trim();
} catch (error) {
  console.error("[repo-clean] git is required and repo must be a git checkout.");
  console.error(error?.stderr?.toString?.() ?? error);
  process.exit(1);
}

const strict = process.env.CI === "true" || process.env.REPO_CLEAN_STRICT === "1";
const lines = status.length ? status.split(/\r?\n/u) : [];

const untracked = lines.filter((line) => line.startsWith("?? "));
const other = lines.filter((line) => !line.startsWith("?? "));

if (untracked.length) {
  console.error("[repo-clean] Untracked files present (artifacts must be opt-in/ignored):");
  console.error("");
  console.error(untracked.join("\n"));
  process.exit(1);
}

if (strict && other.length) {
  console.error("[repo-clean] Working tree is not clean.");
  console.error(
    "[repo-clean] In CI/strict mode, no tracked changes are allowed after gates."
  );
  console.error("");
  console.error(other.join("\n"));
  process.exit(1);
}

console.log("[repo-clean] OK");
