export const runtime = "nodejs";

type FetchMode = "dev_local" | "shield";

function getMode(): FetchMode {
  const env =
    process.env.CHRONOS_MODE ??
    process.env.CHRONOS_FETCH_MODE ??
    process.env.NEXT_PUBLIC_CHRONOS_MODE;
  if (env === "shield" || env === "dev_local") return env;
  return process.env.NODE_ENV === "production" ? "shield" : "dev_local";
}

export async function GET() {
  const mode = getMode();

  if (mode === "dev_local") {
    return Response.json({ status: "ready" }, { status: 200 });
  }

  const shieldUrl = process.env.SHIELD_URL;
  const token = process.env.SHIELD_TOKEN;

  if (!shieldUrl || !token) {
    return Response.json({ status: "not_ready", reason: "shield_missing" }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`${shieldUrl}/health`, { cache: "no-store", signal: controller.signal });
    if (!res.ok) {
      return Response.json({ status: "not_ready", reason: "shield_unhealthy" }, { status: 503 });
    }
    return Response.json({ status: "ready" }, { status: 200 });
  } catch (e) {
    const isTimeout = e instanceof Error && e.name === "AbortError";
    return Response.json({ status: "not_ready", reason: isTimeout ? "shield_timeout" : "shield_unreachable" }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}

