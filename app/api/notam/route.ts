// app/api/notam/route.ts
// GET /api/notam?icao=OPKC
//
// Uses the AviationAPI fallback (see lib/aviation.ts fetchNotams for caveats).
// Always returns success:true with an empty array rather than erroring out —
// a missing NOTAM source shouldn't break the airport page.
import { NextRequest, NextResponse } from "next/server";
import { fetchNotams } from "@/lib/aviation";

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

  const data = await fetchNotams(normalized);
  return NextResponse.json({
    success: true,
    data,
    cached: true,
    timestamp: new Date().toISOString(),
    note: data.length === 0 ? "No NOTAMs returned — source may be unavailable or field has none active." : undefined,
  });
}
