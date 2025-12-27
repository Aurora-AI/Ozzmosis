import path from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";

export interface SafeFsOptions {
  repoRoot: string;
  scopeDir: string; // relative to repoRoot, e.g. "libs/aurora-conductor"
  allowedWritePrefixes: string[]; // relative paths inside scope
}

export class SafeFileSystem {
  private repoRootAbs: string;
  private scopeAbs: string;
  private allowedAbsPrefixes: string[];

  constructor(opts: SafeFsOptions) {
    this.repoRootAbs = path.resolve(opts.repoRoot);
    this.scopeAbs = path.resolve(this.repoRootAbs, opts.scopeDir);

    this.allowedAbsPrefixes = opts.allowedWritePrefixes.map((p) =>
      path.resolve(this.scopeAbs, p)
    );
  }

  private assertInsideRepo(absPath: string) {
    const rel = path.relative(this.repoRootAbs, absPath);
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
      throw new Error(`Path fora do repoRoot: ${absPath}`);
    }
  }

  private assertWriteAllowed(absPath: string) {
    this.assertInsideRepo(absPath);

    const relToScope = path.relative(this.scopeAbs, absPath);
    if (relToScope.startsWith("..") || path.isAbsolute(relToScope)) {
      throw new Error(`Escrita negada (fora do scope): ${absPath}`);
    }

    const ok = this.allowedAbsPrefixes.some((prefix) => {
      const rel = path.relative(prefix, absPath);
      return !(rel.startsWith("..") || path.isAbsolute(rel));
    });

    if (!ok) {
      throw new Error(`Escrita negada (prefixo não autorizado): ${absPath}`);
    }
  }

  async readText(relFromRepoRoot: string): Promise<string> {
    const abs = path.resolve(this.repoRootAbs, relFromRepoRoot);
    this.assertInsideRepo(abs);
    return readFile(abs, "utf8");
  }

  async writeText(relFromRepoRoot: string, content: string): Promise<void> {
    const abs = path.resolve(this.repoRootAbs, relFromRepoRoot);
    this.assertWriteAllowed(abs);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, content, "utf8");
  }
}
