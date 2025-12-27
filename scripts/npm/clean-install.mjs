import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function fatal(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(path.join(repoRoot, "package.json"))) {
  fatal("[install:clean] Run from repo root (missing package.json).");
}

if (!fs.existsSync(path.join(repoRoot, "package-lock.json"))) {
  fatal("[install:clean] Missing package-lock.json at repo root (contract violation).");
}

const nodeModulesPath = path.join(repoRoot, "node_modules");

if (fs.existsSync(nodeModulesPath)) {
  const maxAttempts = 8;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
      break;
    } catch (error) {
      const code = error && typeof error === "object" ? error.code : undefined;
      const retryable = code === "EBUSY" || code === "EPERM" || code === "ENOTEMPTY";
      if (!retryable || attempt === maxAttempts) {
        console.error("[install:clean] Failed to remove node_modules.");
        console.error(
          "[install:clean] Close IDEs/file watchers, stop node processes, and retry."
        );
        console.error(error);
        process.exit(1);
      }
      sleep(250 * attempt);
    }
  }
}

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCmd, ["ci"], { stdio: "inherit" });

process.exit(result.status ?? 1);
