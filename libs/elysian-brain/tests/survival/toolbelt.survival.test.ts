import { describe, expect, it } from "vitest";
import { toolbeltList, toolbeltRun } from "../../src/toolbelt-ts/client";

describe("toolbelt survival (python bridge)", () => {
  function shouldSkip(error: unknown): boolean {
    return !process.env.CI && String(error).includes("TOOLBELT_PYTHON");
  }

  it("lists specs and includes core tools", () => {
    let res: ReturnType<typeof toolbeltList>;
    try {
      res = toolbeltList();
    } catch (error) {
      if (shouldSkip(error)) return;
      throw error;
    }
    expect(res.ok).toBe(true);
    const specs = res.specs as Record<string, unknown>;
    expect(specs["calculator"]).toBeTruthy();
    expect(specs["reference"]).toBeTruthy();
    expect(specs["search_local"]).toBeTruthy();
  });

  it("runs calculator deterministically", () => {
    let res: ReturnType<typeof toolbeltRun>;
    try {
      res = toolbeltRun({
        tool: "calculator",
        input: { expression: "2+2", mode: "standard" },
      });
    } catch (error) {
      if (shouldSkip(error)) return;
      throw error;
    }
    expect(res.ok).toBe(true);
    expect(res.output.value).toBe(4);
  });

  it("returns literal content via reference (inline)", () => {
    let res: ReturnType<typeof toolbeltRun>;
    try {
      res = toolbeltRun({
        tool: "reference",
        input: { ref: "doc:example", mode: "inline", content: "Art. 1o Texto integral." },
      });
    } catch (error) {
      if (shouldSkip(error)) return;
      throw error;
    }
    expect(res.ok).toBe(true);
    expect(res.output.ref).toBe("doc:example");
    expect(res.output.content).toBe("Art. 1o Texto integral.");
    expect(String(res.output.hash)).toMatch(/^sha256:/);
  });

  it("searches deterministically over inline corpus", () => {
    let res: ReturnType<typeof toolbeltRun>;
    try {
      res = toolbeltRun({
        tool: "search_local",
        input: {
          query: "peculato",
          corpus: [{ ref: "norm:example", text: "Art. 312 Peculato ..." }],
          limit: 5,
        },
      });
    } catch (error) {
      if (shouldSkip(error)) return;
      throw error;
    }
    expect(res.ok).toBe(true);
    const results = res.output.results as Array<{ ref: string }>;
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].ref).toBe("norm:example");
  });
});
