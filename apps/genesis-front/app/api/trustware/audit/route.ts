import { NextResponse } from "next/server";
import { getSuitabilityDecision, getTCODecision } from "../../../../src/lib/trustware/decisions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const principal = parseFloat(searchParams.get("principal") || "100000");

  try {
    // Orquestra múltiplas decisões em paralelo
    const [suitability, tco] = await Promise.all([
      getSuitabilityDecision({ pv: principal, rate: 0.01, nper: 120 }),
      getTCODecision(principal)
    ]);

    return NextResponse.json({
      sessionId: "audit-live-" + Date.now(),
      productContext: "Consórcio Imobiliário @ Rodobens",
      timestamp: new Date().toISOString(),
      slots: [suitability, tco]
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { ok: false, error: "Internal Audit Error", details: error.message },
      { status: 500 }
    );
  }
}
