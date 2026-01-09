import { describe, it, expect } from "vitest";

import { startServer } from "../../src/index";

describe("aurora-conductor-service survival", () => {
  it("exports a startable server function without side effects", () => {
    expect(startServer).toBeDefined();
    expect(typeof startServer).toBe("function");
  });
});
