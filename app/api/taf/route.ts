// app/api/taf/route.ts
// GET /api/taf?icao=OPKC
import { NextRequest, NextResponse } from "next/server";
import { fetchTaf } from "@/lib/aviation";

export const runtime = "edge";
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const icao = request.nextUrl.searchParams.get("icao") ?? "";
  const normalized = icao.trim().toUpperCase();

  if (!/^[A-Z0-9]{4}$/.test(normalized)) {
    return NextResponse.json(
      { success: false, error: "Query param 'icao' must be 4 letters/digits, e.g. ?icao=OPKC" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchTaf(normalized);
    return NextResponse.json({
      success: true,
      data,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error fetching TAF" },
      { status: 502 }
    );
  }
}
