import { NextResponse } from "next/server";
import { ProjectListSchema } from "@aurora/trustware";

function isoWithOffsetNow() {
  const d = new Date();
  const tz = -d.getTimezoneOffset();
  const sign = tz >= 0 ? "+" : "-";
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, "0");
  const hh = pad(tz / 60);
  const mm = pad(tz % 60);
  const base = d.toISOString().replace("Z", "");
  return `${base}${sign}${hh}:${mm}`;
}

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
    const now = isoWithOffsetNow();

    return NextResponse.json({
      ok: true,
      projects: [
        {
          id: "4c3b9b7f-2f0a-4b55-9f64-7fcb84a1f0f1",
          codeName: "Elysian Legal Lex",
          biologicalStatus: "VIVO",
          techStack: ["Next.js", "Trustware", "Elysian"],
          repositoryUrl: "https://github.com/Aurora-AI/Elysian",
          owner: "owner@aurora.local",
          lastVitalSign: now
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
          projects: []
        },
        { status: 503 }
      );
    }

    const res = await fetch(`${shieldUrl}/proxy/projects`, {
      cache: "no-store",
      headers: { "X-Organ": "chronos", Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const code: ErrorCode = res.status >= 500 ? "shield_http_5xx" : "shield_http_4xx";
      const status = res.status >= 500 ? 502 : res.status;
      console.error("[chronos][projects] shield_error", { status: res.status, url: `${shieldUrl}/proxy/projects`, code });

      return NextResponse.json(
        { ok: false, code, message: `Shield retornou HTTP ${res.status}`, projects: [] },
        { status }
      );
    }

    const json = await res.json();
    const parsed = ProjectListSchema.parse(json);
    return NextResponse.json({ ok: true, projects: parsed });
  } catch (e) {
    console.error("[chronos][projects] shield_error", {
      code: "unknown",
      error: e instanceof Error ? e.message : String(e)
    });
    return NextResponse.json(
      { ok: false, code: "unknown" satisfies ErrorCode, message: "Falha ao buscar projetos no Shield", projects: [] },
      { status: 503 }
    );
  }
}
