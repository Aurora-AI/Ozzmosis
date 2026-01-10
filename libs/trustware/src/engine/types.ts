// libs/trustware/src/engine/types.ts

export type TrustwareDecision = "allow" | "deny";

export type TrustwareSeverity = "info" | "warn" | "error";

export type TrustwareIssueCode =
  | "REQ_MISSING_FIELD"
  | "REQ_INVALID_TYPE"
  | "REQ_INVALID_VALUE"
  | "POLICY_UNKNOWN"
  | "POLICY_VIOLATION"
  | "POLICY_BLOCKED"
  | "ENGINE_INTERNAL_ERROR";

export type TrustwareIssue = {
  code: TrustwareIssueCode;
  severity: TrustwareSeverity;
  message: string;
  /** Optional machine-readable pointer (e.g., "facts.cnpj") */
  path?: string;
  /** Optional human hints */
  hint?: string;
};

export type TrustwarePolicyMode = "error" | "warn";

/**
 * Minimal policy surface:
 * - required_fields: list of JSON-pointer-ish paths expected in request
 * - blocked_subject_kinds: deny if subject.kind matches any in list
 * - allow_only_sources: if provided, require context.source in set
 *
 * Note: This is intentionally small; expand only with a versioned contract.
 */
export type TrustwarePolicySet = {
  policy_version: string;
  mode: TrustwarePolicyMode;

  required_fields?: string[];
  blocked_subject_kinds?: string[];
  allow_only_sources?: string[];
};

export type TrustwareSubject = {
  /** Domain-neutral: e.g., "proposal", "document", "customer", "operation" */
  kind: string;
  /** Domain-neutral ID, optional */
  id?: string;
};

export type TrustwareContext = {
  /** Who/what is calling: e.g., "alvaro-core", "chronos-backoffice" */
  source: string;
  /** Optional request correlation ID */
  request_id?: string;
  /** Optional timestamp (ISO). Not used for decision unless caller sets policies accordingly. */
  timestamp_iso?: string;
};

export type TrustwareFacts = Record<string, unknown>;

export type TrustwareRequest = {
  request_version: string;
  subject: TrustwareSubject;
  context: TrustwareContext;
  facts: TrustwareFacts;
  policies: TrustwarePolicySet;
};

export type TrustwareVerdict = {
  engine_version: string;
  request_version: string;
  policy_version: string;

  decision: TrustwareDecision;

  /** Stable machine-readable reasons to support downstream UX and audits */
  reason_codes: string[];

  /** Human/ops-facing issues */
  issues: TrustwareIssue[];
};

export type TrustwareEngine = {
  readonly engine_version: string;
  evaluate(req: TrustwareRequest): TrustwareVerdict;
};
