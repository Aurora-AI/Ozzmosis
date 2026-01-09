// libs/trustware/src/engine/engine.ts

import type {
  TrustwareEngine,
  TrustwareIssue,
  TrustwarePolicySet,
  TrustwareRequest,
  TrustwareVerdict,
} from "./types";

const ENGINE_VERSION = "1.0.0";

/**
 * Deterministic, side-effect-free Trustware engine.
 * No filesystem, no network, no time-based decisions.
 */
export class DefaultTrustwareEngine implements TrustwareEngine {
  public readonly engine_version = ENGINE_VERSION;

  public evaluate(req: TrustwareRequest): TrustwareVerdict {
    const issues: TrustwareIssue[] = [];
    const reasonCodes: string[] = [];

    try {
      // 1) Basic shape validation
      if (!req || typeof req !== "object") {
        return this.deny("REQ_INVALID_TYPE", "Request must be an object");
      }

      if (!req.request_version) {
        issues.push(issue("REQ_MISSING_FIELD", "error", "Missing request_version", "request_version"));
      }
      if (!req.subject || typeof req.subject !== "object") {
        issues.push(issue("REQ_INVALID_TYPE", "error", "subject must be an object", "subject"));
      } else {
        if (!req.subject.kind || typeof req.subject.kind !== "string") {
          issues.push(issue("REQ_MISSING_FIELD", "error", "Missing subject.kind", "subject.kind"));
        }
      }

      if (!req.context || typeof req.context !== "object") {
        issues.push(issue("REQ_INVALID_TYPE", "error", "context must be an object", "context"));
      } else {
        if (!req.context.source || typeof req.context.source !== "string") {
          issues.push(issue("REQ_MISSING_FIELD", "error", "Missing context.source", "context.source"));
        }
      }

      if (!req.facts || typeof req.facts !== "object") {
        issues.push(issue("REQ_INVALID_TYPE", "error", "facts must be an object", "facts"));
      }

      // policies must exist and be coherent
      const policies = req.policies as TrustwarePolicySet | undefined;
      if (!policies || typeof policies !== "object") {
        issues.push(issue("REQ_MISSING_FIELD", "error", "Missing policies", "policies"));
      } else {
        if (!policies.policy_version) {
          issues.push(issue("REQ_MISSING_FIELD", "error", "Missing policies.policy_version", "policies.policy_version"));
        }
        if (!policies.mode || (policies.mode !== "error" && policies.mode !== "warn")) {
          issues.push(issue("REQ_INVALID_VALUE", "error", "policies.mode must be 'error' or 'warn'", "policies.mode"));
        }
      }

      // If structural errors, deny immediately (hard contract)
      const structuralErrors = issues.filter((i) => i.severity === "error");
      if (structuralErrors.length > 0) {
        reasonCodes.push("STRUCTURAL_VALIDATION_FAILED");
        return {
          engine_version: ENGINE_VERSION,
          request_version: req?.request_version ?? "unknown",
          policy_version: policies?.policy_version ?? "unknown",
          decision: "deny",
          reason_codes: dedupe(reasonCodes),
          issues: structuralErrors,
        };
      }

      // 2) Apply policy checks (deterministic)
      const policyIssues = applyPolicies(req);
      for (const pi of policyIssues) issues.push(pi);

      const mode = req.policies.mode;
      const hasPolicyError = issues.some((i) => i.severity === "error");

      if (hasPolicyError && mode === "error") {
        reasonCodes.push("POLICY_MODE_ERROR_BLOCK");
        reasonCodes.push("POLICY_VIOLATION");
        return {
          engine_version: ENGINE_VERSION,
          request_version: req.request_version,
          policy_version: req.policies.policy_version,
          decision: "deny",
          reason_codes: dedupe(reasonCodes),
          issues,
        };
      }

      // warn mode: allow but with issues
      if (issues.length > 0) {
        reasonCodes.push("POLICY_VIOLATION");
      }

      return {
        engine_version: ENGINE_VERSION,
        request_version: req.request_version,
        policy_version: req.policies.policy_version,
        decision: "allow",
        reason_codes: dedupe(reasonCodes),
        issues,
      };
    } catch (e) {
      return this.deny("ENGINE_INTERNAL_ERROR", "Unhandled engine error", String(e));
    }
  }

  private deny(code: string, message: string, detail?: string): TrustwareVerdict {
    const issues: TrustwareIssue[] = [
      issue("ENGINE_INTERNAL_ERROR", "error", message, undefined, detail ? `detail: ${detail}` : undefined),
    ];
    return {
      engine_version: ENGINE_VERSION,
      request_version: "unknown",
      policy_version: "unknown",
      decision: "deny",
      reason_codes: dedupe([code]),
      issues,
    };
  }
}

function applyPolicies(req: TrustwareRequest): TrustwareIssue[] {
  const issues: TrustwareIssue[] = [];
  const p = req.policies;

  // required_fields: paths like "facts.cnpj" or "context.source"
  for (const path of p.required_fields ?? []) {
    if (!hasPath(req, path)) {
      issues.push(
        issue(
          "POLICY_VIOLATION",
          p.mode === "error" ? "error" : "warn",
          `Missing required field: ${path}`,
          path,
          "Provide the field or adjust policy.required_fields"
        )
      );
    }
  }

  // blocked_subject_kinds
  if ((p.blocked_subject_kinds ?? []).includes(req.subject.kind)) {
    issues.push(
      issue(
        "POLICY_BLOCKED",
        "error",
        `Blocked subject kind: ${req.subject.kind}`,
        "subject.kind",
        "Change subject.kind or adjust policy.blocked_subject_kinds"
      )
    );
  }

  // allow_only_sources
  if (p.allow_only_sources && p.allow_only_sources.length > 0) {
    if (!p.allow_only_sources.includes(req.context.source)) {
      issues.push(
        issue(
          "POLICY_VIOLATION",
          "error",
          `Caller source not allowed: ${req.context.source}`,
          "context.source",
          "Adjust policy.allow_only_sources"
        )
      );
    }
  }

  return issues;
}

function issue(
  code: TrustwareIssue["code"],
  severity: TrustwareIssue["severity"],
  message: string,
  path?: string,
  hint?: string
): TrustwareIssue {
  return { code, severity, message, path, hint };
}

function hasPath(obj: unknown, path: string): boolean {
  const parts = path.split(".").filter(Boolean);
  let cur: any = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object" || !(part in cur)) return false;
    cur = (cur as any)[part];
  }
  return cur !== undefined;
}

function dedupe(xs: string[]): string[] {
  return Array.from(new Set(xs));
}
