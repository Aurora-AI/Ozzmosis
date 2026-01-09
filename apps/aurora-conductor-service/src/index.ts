export type { ConductorEnv as ConductorServiceConfig } from "./config.js";

export async function startServer(): Promise<void> {
  await import("./server.js");
}
