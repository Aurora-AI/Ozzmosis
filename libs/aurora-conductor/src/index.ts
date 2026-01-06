/**
 * Aurora Conductor - Main API Entrypoint
 * 
 * Public API for orchestrating AI-assisted code composition with context awareness,
 * policy enforcement, and safe file system operations.
 * 
 * @packageDocumentation
 */

// ============================================================================
// Conductor Contract (Public API)
// ============================================================================
export type ConductorEvent = {
  id: string;
  type: string;
  payload: unknown;
  occurred_at: string; // ISO-8601
};

export type PolicyVerdict = {
  allowed: boolean;
  reason_code: string;
};

export type OrchestrationResult = {
  event_id: string;
  status: "COMMITTED" | "REJECTED";
  reason_code?: string;
};

export interface ShieldPort {
  validate(event: ConductorEvent): Promise<PolicyVerdict>;
}

export interface ChronosPort {
  record(event: ConductorEvent, result: OrchestrationResult): Promise<void>;
}

export interface BrainPort {
  enrich(event: ConductorEvent): Promise<ConductorEvent>;
}

export class Conductor {
  constructor(
    private readonly shield: ShieldPort,
    private readonly chronos: ChronosPort,
    private readonly brain: BrainPort
  ) {}

  async handle(event: ConductorEvent): Promise<OrchestrationResult> {
    const enriched = await this.brain.enrich(event);

    const verdict = await this.shield.validate(enriched);
    if (!verdict.allowed) {
      return {
        event_id: event.id,
        status: "REJECTED",
        reason_code: verdict.reason_code
      };
    }

    const result: OrchestrationResult = {
      event_id: event.id,
      status: "COMMITTED"
    };

    await this.chronos.record(enriched, result);
    return result;
  }
}

// ============================================================================
// Core Composer API
// ============================================================================
export { compose, type ComposeOptions } from "./core/composer.js";

// ============================================================================
// Context Loading
// ============================================================================
export {
  loadContext,
  type LoadContextOptions,
  type LoadedContext,
  type ContextSource,
  type ContextSourceKind
} from "./core/context-loader.js";

// ============================================================================
// Config Loading
// ============================================================================
export {
  loadConfig,
  AuroraConfigSchema,
  type AuroraConfig,
  type LoadConfigOptions
} from "./core/config-loader.js";

// ============================================================================
// Safe File System
// ============================================================================
export { SafeFileSystem, type SafeFsOptions } from "./core/file-system.js";

// ============================================================================
// Trustware (Policy & Schemas)
// ============================================================================
export { checkPolicy } from "./trustware/policy-checker.js";
export {
  RunArtifactSchema,
  PolicyResultSchema,
  PolicyViolationSchema,
  type RunArtifact,
  type PolicyResult
} from "./trustware/schemas.js";

// ============================================================================
// Homeostasis (Linting & Reflection)
// ============================================================================
export { runLint, type LintResult } from "./homeostasis/linter-bridge.js";
export {
  reflect,
  type ReflectInput,
  type ReflectOutput
} from "./homeostasis/reflector.js";
