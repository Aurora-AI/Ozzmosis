import { describe, it, expect } from "vitest";
import { SafeFileSystem } from "../../src/core/file-system.js";

describe("SafeFileSystem (fs guard)", () => {
  it("nega escrita fora do scope", async () => {
    const fs = new SafeFileSystem({
      repoRoot: process.cwd(),
      scopeDir: "libs/aurora-conductor",
      allowedWritePrefixes: [".artifacts"]
    });

    await expect(fs.writeText("README_OUTSIDE.md", "nope")).rejects.toThrow(
      /fora do scope|prefixo não autorizado|Escrita negada/i
    );
  });

  it("permite escrita dentro de .artifacts", async () => {
    const fs = new SafeFileSystem({
      repoRoot: process.cwd(),
      scopeDir: "libs/aurora-conductor",
      allowedWritePrefixes: [".artifacts"]
    });

    await expect(
      fs.writeText("libs/aurora-conductor/.artifacts/test.txt", "ok")
    ).resolves.toBeUndefined();
  });
});
