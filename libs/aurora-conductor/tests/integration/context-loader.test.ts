import { describe, it, expect, vi } from "vitest";
import { loadContext } from "../../src/core/context-loader.js";

describe("context-loader (resiliente)", () => {
  it("carrega constituição quando presente, senão retorna contexto mínimo", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const ctx = await loadContext(process.cwd());
    const hasConstitution = ctx.sources.some((s) => s.kind === "constitution");

    if (hasConstitution) {
      expect(ctx.constitutionText.length).toBeGreaterThan(10);
    } else {
      expect(ctx.constitutionText).toBe("");
      expect(warnSpy).toHaveBeenCalled();
    }

    warnSpy.mockRestore();
  });
});
