import { describe, it, expect } from "vitest";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import { createTempRepoFromFixture, withCwd, captureWarns } from "./_helpers.js";

import type { ComposeOptions } from "../../dist/index.js";
import {
  compose,
  loadConfig,
  loadContext,
  SafeFileSystem,
  RunArtifactSchema
} from "../../dist/index.js";
import { Conductor, type ConductorEvent } from "../../dist/index.js";
import { ShieldStub } from "../../dist/stubs/shield.stub.js";
import { ChronosStub } from "../../dist/stubs/chronos.stub.js";
import { BrainStub } from "../../dist/stubs/brain.stub.js";

async function withTempRepo<T>(fixtureName: string, fn: (repoRoot: string) => Promise<T>) {
  const { repoRoot, cleanup } = await createTempRepoFromFixture(fixtureName);
  try {
    return await fn(repoRoot);
  } finally {
    await cleanup();
  }
}

function normalizeArtifactForDeterminism(input: unknown) {
  const artifact = RunArtifactSchema.parse(input);
  return {
    ...artifact,
    plan: artifact.plan.replaceAll("\r\n", "\n")
  };
}

describe("Aurora Conductor - survival tests (blackbox)", () => {
  it("T1: boot sem config (modo resiliente)", async () => {
    await withTempRepo("repo-empty", async (repoRoot) => {
      const warnCapture = captureWarns();
      try {
        await withCwd(repoRoot, async () => {
          const cfg = await loadConfig(repoRoot);
          expect(cfg.policy.mode).toBe("warn");

          const opts: ComposeOptions = { repoRoot, dryRun: true, writeArtifacts: true };
          const artifact = await compose("spec: minimal", opts);
          expect(artifact.spec).toBe("spec: minimal");
          expect(artifact.proposedFileChanges).toEqual([]);
          expect(Array.isArray(artifact.sources)).toBe(true);
        });
      } finally {
        warnCapture.restore();
      }

      expect(warnCapture.warns.join("\n")).toMatch(/aurora\.config/i);
      expect(warnCapture.warns.join("\n")).toMatch(/constitui/i);
    });
  });

  it("T2: config inválido falha com mensagem cirúrgica", async () => {
    await withTempRepo("repo-bad-config", async (repoRoot) => {
      await expect(loadConfig(repoRoot)).rejects.toThrow(/aurora\.config/i);
      await expect(loadConfig(repoRoot)).rejects.toThrow(/policy\.mode/i);
    });
  });

  it("T3: docs ausentes não derrubam loadContext/compose (warn-only)", async () => {
    await withTempRepo("repo-missing-docs", async (repoRoot) => {
      const warnCapture = captureWarns();
      try {
        const config = await loadConfig(repoRoot);
        const ctx = await loadContext(repoRoot, { config });
        expect(ctx.constitutionText.length).toBeGreaterThan(0);
        expect(ctx.sources.some((s) => s.kind === "constitution")).toBe(true);
        expect(ctx.sources.some((s) => s.kind === "manual")).toBe(false);

        await expect(
          compose("spec: missing docs ok", { repoRoot, dryRun: true, writeArtifacts: true })
        ).resolves.toBeDefined();
      } finally {
        warnCapture.restore();
      }

      expect(warnCapture.warns.join("\n")).toMatch(/manual/i);
      expect(warnCapture.warns.join("\n")).toMatch(/does-not-exist/i);
    });
  });

  it("T4: compose determinístico (mesma entrada, mesmo output)", async () => {
    await withTempRepo("repo-minimal", async (repoRoot) => {
      const spec = "spec: determinism";
      const a1 = await compose(spec, { repoRoot, dryRun: true, writeArtifacts: true });
      const a2 = await compose(spec, { repoRoot, dryRun: true, writeArtifacts: true });

      expect(normalizeArtifactForDeterminism(a1)).toEqual(normalizeArtifactForDeterminism(a2));
    });
  });

  it("T5: SafeFileSystem bloqueia path traversal (read/write)", async () => {
    await withTempRepo("repo-minimal", async (repoRoot) => {
      const fs = new SafeFileSystem({
        repoRoot,
        scopeDir: ".",
        allowedWritePrefixes: [".artifacts"]
      });

      await expect(fs.readText("../outside.txt")).rejects.toThrow(/fora do repoRoot/i);
      await expect(fs.writeText("../outside.txt", "nope")).rejects.toThrow(/fora do repoRoot/i);

      const absOutside =
        process.platform === "win32"
          ? path.join(path.parse(repoRoot).root, "aurora-conductor-abs-outside.txt")
          : "/aurora-conductor-abs-outside.txt";

      await expect(fs.readText(absOutside)).rejects.toThrow(/fora do repoRoot/i);
      await expect(fs.writeText(absOutside, "nope")).rejects.toThrow(/fora do repoRoot/i);

      if (process.platform === "win32") {
        const uncOutside = "\\\\server\\share\\aurora-conductor-unc-outside.txt";
        await expect(fs.readText(uncOutside)).rejects.toThrow(/fora do repoRoot/i);
        await expect(fs.writeText(uncOutside, "nope")).rejects.toThrow(/fora do repoRoot/i);
      }

      await expect(fs.writeText(".artifacts/ok.txt", "ok")).resolves.toBeUndefined();
    });
  });

  it("T6: policy mode=ERROR bloqueia execução quando há violação", async () => {
    await withTempRepo("repo-monorepo-like", async (repoRoot) => {
      const outAbs = path.resolve(repoRoot, ".artifacts", "aurora-conductor", "last-run.json");

      await expect(
        compose("spec: use CUDA now", { repoRoot, dryRun: true, writeArtifacts: true })
      ).rejects.toThrow(
        /policy|POLICY_CPU_ONLY|violat/i
      );

      expect(existsSync(outAbs)).toBe(false);
    });
  });

  it("T7: public API freeze (exports mínimos presentes)", async () => {
    const api = await import("../../dist/index.js");

    for (const name of ["compose", "loadContext", "loadConfig", "SafeFileSystem"] as const) {
      if (!(name in api)) throw new Error(`breaking change: missing export '${name}'`);
    }
  });

  it("T7b: schemas críticos continuam expostos", async () => {
    const api = await import("../../dist/index.js");
    for (const name of ["RunArtifactSchema", "PolicyResultSchema", "PolicyViolationSchema"] as const) {
      if (!(name in api)) throw new Error(`breaking change: missing export '${name}'`);
    }
  });

  it("T7c: artifacts sempre validam contra schema público", async () => {
    await withTempRepo("repo-minimal", async (repoRoot) => {
      const artifact = await compose("spec: schema", { repoRoot, dryRun: true, writeArtifacts: true });
      expect(() => RunArtifactSchema.parse(artifact)).not.toThrow();

      const artifactsPath = path.resolve(repoRoot, ".artifacts", "aurora-conductor", "last-run.json");
      const raw = await readFile(artifactsPath, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      expect(normalizeArtifactForDeterminism(parsed)).toEqual(normalizeArtifactForDeterminism(artifact));
    });
  });

  it("T8: orchestracao end-to-end (commit e reject)", async () => {
    const conductor = new Conductor(new ShieldStub(), new ChronosStub(), new BrainStub());

    const baseEvent: ConductorEvent = {
      id: "evt-1",
      type: "TEST",
      payload: {},
      occurred_at: new Date().toISOString()
    };

    const committed = await conductor.handle(baseEvent);
    expect(committed.status).toBe("COMMITTED");

    class DenyShield extends ShieldStub {
      async validate(_: ConductorEvent) {
        return { allowed: false, reason_code: "DENIED_BY_POLICY" };
      }
    }

    const rejected = await new Conductor(new DenyShield(), new ChronosStub(), new BrainStub()).handle({
      ...baseEvent,
      id: "evt-2"
    });
    expect(rejected.status).toBe("REJECTED");
    expect(rejected.reason_code).toBe("DENIED_BY_POLICY");
  });
});
