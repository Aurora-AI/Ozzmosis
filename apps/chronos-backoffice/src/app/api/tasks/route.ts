import { NextResponse } from "next/server";

export function GET() {
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
