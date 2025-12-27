import { CHRONOS_VERSION } from "../dist/index.js";

if (!CHRONOS_VERSION) {
  console.error("[chronos:smoke] Missing CHRONOS_VERSION export");
  process.exit(1);
}

console.log("[chronos:smoke] OK", CHRONOS_VERSION);

