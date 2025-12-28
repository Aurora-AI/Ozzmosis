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
    const now = isoWithOffsetNow();

    return NextResponse.json([
      {
        id: "4c3b9b7f-2f0a-4b55-9f64-7fcb84a1f0f1",
        codeName: "Elysian Legal Lex",
        biologicalStatus: "VIVO",
        techStack: ["Next.js", "Trustware", "Elysian"],
        repositoryUrl: "https://github.com/Aurora-AI/Elysian",
        owner: "owner@aurora.local",
        lastVitalSign: now
      }
    ]);
  }

  try {
    const shieldUrl = required("SHIELD_URL", process.env.SHIELD_URL);
    const token = required("SHIELD_TOKEN", process.env.SHIELD_TOKEN);

    const res = await fetch(`${shieldUrl}/proxy/projects`, {
      cache: "no-store",
      headers: { "X-Organ": "chronos", Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      return NextResponse.json({ error: `shield_http_${res.status}` }, { status: res.status });
    }

    const json = await res.json();
    const parsed = ProjectListSchema.parse(json);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "shield_proxy_error" },
      { status: 500 }
    );
  }
}
