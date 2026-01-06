import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = process.env.SHIELD_SMOKE_PORT ?? "4011";
const token = "smoke-token";
const baseUrl = `http://127.0.0.1:${port}`;

const env = {
  ...process.env,
  SHIELD_PORT: port,
  SHIELD_TOKEN: token,
};

const server = spawn("node", ["dist/server.js"], {
  env,
  stdio: "inherit",
});

const fetchJson = async (path, auth = false) => {
  const headers = auth ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${baseUrl}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`shield_smoke_http_${res.status}`);
  }
  return res.json();
};

const waitForHealth = async () => {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      await fetchJson("/health");
      return;
    } catch (err) {
      await sleep(200);
    }
  }
  throw new Error("shield_smoke_timeout");
};

try {
  await waitForHealth();
  await fetchJson("/proxy/projects", true);
  await fetchJson("/proxy/tasks", true);
  console.log("shield.smoke OK");
  server.kill();
  process.exit(0);
} catch (err) {
  console.error(err);
  server.kill();
  process.exit(1);
}
