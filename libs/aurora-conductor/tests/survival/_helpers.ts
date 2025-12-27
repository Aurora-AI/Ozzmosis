import { cp, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

export function fixturesRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "fixtures");
}

export async function createTempRepoFromFixture(
  fixtureName: string
): Promise<{ repoRoot: string; cleanup: () => Promise<void> }> {
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "aurora-conductor-survival-"));
  const repoRoot = path.join(tmpRoot, fixtureName);
  const src = path.join(fixturesRoot(), fixtureName);
  await cp(src, repoRoot, { recursive: true });

  return {
    repoRoot,
    cleanup: async () => rm(tmpRoot, { recursive: true, force: true })
  };
}

export async function withCwd<T>(cwd: string, fn: () => Promise<T>): Promise<T> {
  const prev = process.cwd();
  process.chdir(cwd);
  try {
    return await fn();
  } finally {
    process.chdir(prev);
  }
}

export function captureWarns(): { warns: string[]; restore: () => void } {
  const warns: string[] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    warns.push(args.map(String).join(" "));
  };
  return {
    warns,
    restore: () => {
      console.warn = original;
    }
  };
}
