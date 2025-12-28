import { NextResponse } from "next/server";
import { TaskListSchema } from "@aurora/trustware";

export const runtime = "nodejs";

type FetchMode = "dev_local" | "shield";
type ErrorCode = "shield_missing" | "shield_http_5xx" | "shield_http_4xx" | "unknown";

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
    return NextResponse.json({
      ok: true,
      tasks: [
        {
          id: "6d3b4a80-7c7a-4b88-8f2e-4b18e2d2a9a1",
          projectId: "4c3b9b7f-2f0a-4b55-9f64-7fcb84a1f0f1",
          title: "Genesis: Chronos Plug-and-Play",
          effort: 13,
          dependencies: [],
          assignee: "owner@aurora.local"
        },
        {
          id: "9f1acb6d-3b71-45b3-ae49-0b6f7b8d5a33",
          projectId: "4c3b9b7f-2f0a-4b55-9f64-7fcb84a1f0f1",
          title: "Elysian Lex: validar ciclo de deploy Vercel",
          effort: 8,
          dependencies: ["6d3b4a80-7c7a-4b88-8f2e-4b18e2d2a9a1"],
          assignee: "owner@aurora.local"
        }
      ]
    });
  }

  try {
    const shieldUrl = process.env.SHIELD_URL;
    const token = process.env.SHIELD_TOKEN;

    if (!shieldUrl || !token) {
      return NextResponse.json(
        {
          ok: false,
          code: "shield_missing" satisfies ErrorCode,
          message: "Butantan Shield obrigatório em produção (SHIELD_URL/SHIELD_TOKEN ausentes)",
          tasks: []
        },
        { status: 503 }
      );
    }

    const res = await fetch(`${shieldUrl}/proxy/tasks`, {
      cache: "no-store",
      headers: { "X-Organ": "chronos", Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const code: ErrorCode = res.status >= 500 ? "shield_http_5xx" : "shield_http_4xx";
      const status = res.status >= 500 ? 502 : res.status;
      console.error("[chronos][tasks] shield_error", { status: res.status, url: `${shieldUrl}/proxy/tasks`, code });

      return NextResponse.json(
        { ok: false, code, message: `Shield retornou HTTP ${res.status}`, tasks: [] },
        { status }
      );
    }

    const json = await res.json();
    const parsed = TaskListSchema.parse(json);
    return NextResponse.json({ ok: true, tasks: parsed });
  } catch (e) {
    console.error("[chronos][tasks] shield_error", { code: "unknown", error: e instanceof Error ? e.message : String(e) });
    return NextResponse.json(
      { ok: false, code: "unknown" satisfies ErrorCode, message: "Falha ao buscar tasks no Shield", tasks: [] },
      { status: 503 }
    );
  }
}
