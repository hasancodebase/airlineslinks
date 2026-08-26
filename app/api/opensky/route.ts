// app/api/opensky/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchStatesInBbox, isOpenSkyConfigured } from "@/lib/opensky";

export const runtime = "nodejs"; // uses env vars + a token cache; Node runtime keeps that simple

function parseCoord(value: string | null, fallback: number): number {
  const n = value === null ? NaN : parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(request: NextRequest) {
  if (!isOpenSkyConfigured()) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "OpenSky credentials are not set. Add OPENSKY_CLIENT_ID and OPENSKY_CLIENT_SECRET to .env.local — free account at https://opensky-network.org.",
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  // Default bbox: roughly the Arabian Gulf / Karachi region as a sane default view.
  const lamin = parseCoord(searchParams.get("lamin"), 20);
  const lomin = parseCoord(searchParams.get("lomin"), 55);
  const lamax = parseCoord(searchParams.get("lamax"), 33);
  const lomax = parseCoord(searchParams.get("lomax"), 78);

  try {
    const states = await fetchStatesInBbox({ lamin, lomin, lamax, lomax });
    return NextResponse.json({ states, count: states.length });
  } catch (err) {
    console.error("OpenSky fetch failed:", err);
    return NextResponse.json(
      { error: "upstream_error", message: "Failed to fetch live traffic data." },
      { status: 502 }
    );
  }
}
