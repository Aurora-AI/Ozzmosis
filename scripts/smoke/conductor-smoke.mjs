import path from "node:path";
import { fileURLToPath } from "node:url";

// Imports do pacote Aurora Conductor
import * as Conductor from "../../libs/aurora-conductor/dist/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(cond, msg) {
  if (!cond) throw new Error(`❌ ${msg}`);
}

console.log("=== Aurora Conductor Smoke Test ===\n");

// Test 1: Verificar que exports não estão vazios
const exportKeys = Object.keys(Conductor);
console.log("[✓] Conductor exports:", exportKeys);
assert(exportKeys.length > 0, "Conductor export list is empty.");

// Test 2: Verificar API pública mínima esperada
const expectedExports = [
  "compose",
  "loadContext",
  "SafeFileSystem",
  "checkPolicy",
  "RunArtifactSchema",
  "PolicyResultSchema"
];

for (const exp of expectedExports) {
  assert(exp in Conductor, `Expected export '${exp}' not found`);
  console.log(`[✓] Export '${exp}' exists`);
}

// Test 3: Executar smoke funcional - compose com dryRun
console.log(`\n[TEST] Running compose (context-loader + file-system + composer)...`);

const repoRoot = path.resolve(__dirname, "../..");
const spec = "Create a simple TypeScript module for testing";

try {
  const result = await Conductor.compose(spec, {
    repoRoot,
    dryRun: true
  });
  
  console.log(`[✓] Compose returned a RunArtifact:`, {
    spec: result.spec,
    sources_count: result.sources.length,
    plan_length: result.plan.length,
    policy_pass: result.policy.pass,
    policy_violations: result.policy.violations.length
  });
  
  assert(result.spec === spec, "Spec mismatch");
  assert(Array.isArray(result.sources), "Sources should be array");
  assert(typeof result.plan === "string", "Plan should be string");
  assert(result.plan.length > 0, "Plan should not be empty");
  assert(result.policy.pass === true, "Policy should pass");
  
} catch (err) {
  console.error(`[ERROR] Compose failed:`, err.message);
  if (err.cause) console.error(`[ERROR] Cause:`, err.cause);
  process.exit(1);
}

console.log(`\n[✓] API contract validated`);
console.log(`[✓] Total exports: ${exportKeys.length}`);
console.log(`[✓] Functional smoke test passed`);

console.log("\n=== ✅ SMOKE PASSED ===");
process.exit(0);
