/**
 * Aurora Conductor - Main API Entrypoint
 * 
 * Public API for orchestrating AI-assisted code composition with context awareness,
 * policy enforcement, and safe file system operations.
 * 
 * @packageDocumentation
 */

// ============================================================================
// Core Composer API
// ============================================================================
export { compose, type ComposeOptions } from "./core/composer.js";

// ============================================================================
// Context Loading
// ============================================================================
export {
  loadContext,
  type LoadedContext,
  type ContextSource,
  type ContextSourceKind
} from "./core/context-loader.js";

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
