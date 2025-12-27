import { NextResponse } from "next/server";
import { TaskListSchema } from "@aurora/trustware";

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

function required(name: string, v?: string) {
  if (!v) throw new Error(`missing_env_${name}`);
  return v;
}

export async function GET() {
  const mode = getMode();

  if (mode === "dev_local") {
    return NextResponse.json([
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
    ]);
  }

  try {
    const shieldUrl = required("SHIELD_URL", process.env.SHIELD_URL);
    const token = required("SHIELD_TOKEN", process.env.SHIELD_TOKEN);

    const res = await fetch(`${shieldUrl}/proxy/tasks`, {
      cache: "no-store",
      headers: { "X-Organ": "chronos", Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      return NextResponse.json({ error: `shield_http_${res.status}` }, { status: res.status });
    }

    const json = await res.json();
    const parsed = TaskListSchema.parse(json);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "shield_proxy_error" },
      { status: 500 }
    );
  }
}
