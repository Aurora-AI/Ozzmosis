import type { PolicyResult } from "./schemas.js";

const FORBIDDEN_TOKENS = ["CUDA", "cuDNN", "NVIDIA", "GPU"];

export function checkPolicy(input: { plan: string }): PolicyResult {
  const violations: Array<{ code: string; message: string }> = [];

  for (const token of FORBIDDEN_TOKENS) {
    if (input.plan.toLowerCase().includes(token.toLowerCase())) {
      violations.push({
        code: "POLICY_CPU_ONLY",
        message: `Plano menciona tecnologia proibida para build CPU-only: ${token}`
      });
    }
  }

  const pass = violations.length === 0;
  return { pass, violations };
}
