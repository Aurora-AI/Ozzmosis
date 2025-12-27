import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const srcTemplates = path.join(repoRoot, "src", "templates");
const distTemplates = path.join(repoRoot, "dist", "templates");

await mkdir(distTemplates, { recursive: true });
await cp(srcTemplates, distTemplates, { recursive: true });
