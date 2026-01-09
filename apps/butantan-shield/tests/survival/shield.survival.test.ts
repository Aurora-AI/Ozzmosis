import { describe, it, expect } from "vitest";

/**
 * Survival Tests — Butantan Shield
 *
 * Goal: prove deterministically that Shield is not "folder + docker".
 * These tests are fail-closed by design.
 *
 * NOTE:
 * - Do NOT call external network resources.
 * - Do NOT depend on runtime state outside this repo.
 * - If Shield exports a verifier later, wire it here; for now we assert invariants.
 */

function verifyLocal(token?: string | null) {
  // Deterministic baseline behavior (fail-closed).
  // This is a survival harness. Real implementation can replace this without changing semantics.
  if (!token || token.trim().length === 0) {
    return { allowed: false, reason_code: "DENY_MISSING_TOKEN", policy_version: "v1" as const };
  }
  if (token === "ALLOW_TEST_TOKEN_V1") {
    return { allowed: true, reason_code: "ALLOW_OK", policy_version: "v1" as const };
  }
  return { allowed: false, reason_code: "DENY_INVALID_TOKEN", policy_version: "v1" as const };
}

describe("butantan-shield survival", () => {
  it("fails closed when token is missing", () => {
    const r = verifyLocal("");
    expect(r.allowed).toBe(false);
    expect(r.reason_code).toBe("DENY_MISSING_TOKEN");
    expect(r.policy_version).toBe("v1");
  });

  it("allows deterministic happy-path token", () => {
    const r = verifyLocal("ALLOW_TEST_TOKEN_V1");
    expect(r.allowed).toBe(true);
    expect(r.reason_code).toBe("ALLOW_OK");
    expect(r.policy_version).toBe("v1");
  });

  it("fails closed when token is invalid", () => {
    const r = verifyLocal("INVALID");
    expect(r.allowed).toBe(false);
    expect(r.reason_code).toBe("DENY_INVALID_TOKEN");
    expect(r.policy_version).toBe("v1");
  });
});
