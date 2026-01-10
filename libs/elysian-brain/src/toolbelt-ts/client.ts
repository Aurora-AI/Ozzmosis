import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import type { ToolCall, ToolListResult, ToolResult } from "./types";

function runPython(payload: unknown): string {
  const moduleDir = fileURLToPath(new URL(".", import.meta.url));
  const moduleRoot = path.resolve(moduleDir, "..");
  const pythonPath = process.env.PYTHONPATH
    ? `${moduleRoot}${path.delimiter}${process.env.PYTHONPATH}`
    : moduleRoot;
  const proc = spawnSync("python", ["-m", "elysian_brain.toolbelt.cli"], {
    input: JSON.stringify(payload),
    encoding: "utf-8",
    env: { ...process.env, PYTHONPATH: pythonPath },
  });

  if (proc.error) {
    throw new Error(`TOOLBELT_PYTHON_ERROR: ${proc.error.message}`);
  }

  const stdout = (proc.stdout ?? "").toString();
  if (!stdout.trim()) {
    const stderr = (proc.stderr ?? "").toString().trim();
    throw new Error(`TOOLBELT_PYTHON_FAILED: ${stderr || "no output"}`);
  }

  return stdout;
}

export function toolbeltList(): ToolListResult {
  return JSON.parse(runPython({ op: "list" })) as ToolListResult;
}

export function toolbeltRun(call: ToolCall): ToolResult {
  return JSON.parse(runPython(call)) as ToolResult;
}
