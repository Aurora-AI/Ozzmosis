import { NextResponse } from "next/server";

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

export function GET() {
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
