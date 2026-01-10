import { describe, expect, it } from "vitest";
import { toolbeltList, toolbeltRun } from "../../src/toolbelt-ts/client";

describe("toolbelt survival (python bridge)", () => {
  it("lists specs", () => {
    let res: ReturnType<typeof toolbeltList>;
    try {
      res = toolbeltList();
    } catch (error) {
      if (!process.env.CI && String(error).includes("TOOLBELT_PYTHON")) {
        return;
      }
      throw error;
    }
    expect(res.ok).toBe(true);
  });

  it("runs calculator deterministically", () => {
    let res: ReturnType<typeof toolbeltRun>;
    try {
      res = toolbeltRun({
        tool: "calculator",
        input: { expression: "2+2", mode: "standard" },
      });
    } catch (error) {
      if (!process.env.CI && String(error).includes("TOOLBELT_PYTHON")) {
        return;
      }
      throw error;
    }
    expect(res.ok).toBe(true);
    expect(res.output.value).toBe(4);
  });
});
