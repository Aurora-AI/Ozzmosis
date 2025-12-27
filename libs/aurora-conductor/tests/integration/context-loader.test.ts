import { describe, it, expect } from "vitest";
import { loadContext } from "../../src/core/context-loader.js";

describe("context-loader (resiliente)", () => {
  it("carrega constituição OU falha com erro orientador", async () => {
    try {
      const ctx = await loadContext(process.cwd());
      expect(ctx.constitutionText.length).toBeGreaterThan(10);
      expect(ctx.sources.some((s) => s.kind === "constitution")).toBe(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/Constituição não encontrada/i);
      expect(msg).toMatch(/Instruções Projeto Aurora/i);
    }
  });
});
