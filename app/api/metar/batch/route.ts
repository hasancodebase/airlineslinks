// app/api/metar/batch/route.ts
// GET /api/metar/batch?icaos=OPKC,EGLL,KJFK
import { NextRequest, NextResponse } from "next/server";
import { fetchMetar, fetchTaf, decodeFlightCategory } from "@/lib/aviation";
import { getAirportByIcao } from "@/lib/airports";

// Not "edge" — getAirportByIcao reads public/airports.json via fs, which
// requires the Node.js runtime.
export const revalidate = 60;

const MAX_CODES = 12;

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("icaos") ?? "";

  const codes = Array.from(
    new Set(
      raw
        .split(/[\s,]+/)
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean)
    )
  );

  if (codes.length === 0) {
    return NextResponse.json(
      { success: false, error: "Provide one or more ICAO codes, e.g. ?icaos=OPKC,EGLL,KJFK" },
      { status: 400 }
    );
  }

  const invalid = codes.filter((c) => !/^[A-Z0-9]{4}$/.test(c));
  if (invalid.length > 0) {
    return NextResponse.json(
      { success: false, error: `Invalid ICAO code(s): ${invalid.join(", ")} — must be 4 letters/digits` },
      { status: 400 }
    );
  }

  if (codes.length > MAX_CODES) {
    return NextResponse.json(
      { success: false, error: `Too many codes — max ${MAX_CODES} at once` },
      { status: 400 }
    );
  }

  const results = await Promise.all(
    codes.map(async (icao) => {
      const airport = getAirportByIcao(icao);

      // Fetch METAR and TAF independently — a TAF failure shouldn't hide a
      // working METAR, and vice versa.
      const [metarResult, tafResult] = await Promise.allSettled([
        fetchMetar(icao),
        fetchTaf(icao),
      ]);

      const rawTaf =
        tafResult.status === "fulfilled" ? tafResult.value[0]?.rawTAF ?? null : null;

      if (metarResult.status === "rejected") {
        return {
          icao,
          found: Boolean(airport),
          city: airport?.city ?? null,
          country: airport?.country ?? null,
          category: "UNKNOWN" as const,
          wind: "—",
          windGustKt: null,
          tempC: null,
          dewpointC: null,
          visibilitySm: null,
          altimeterInHg: null,
          observedAt: null,
          rawMetar: null,
          rawTaf,
          error: metarResult.reason instanceof Error
            ? metarResult.reason.message
            : "Failed to fetch METAR",
        };
      }

      const metar = metarResult.value[0];
      const visibilitySm =
        typeof metar?.visib === "number"
          ? metar.visib
          : parseFloat(String(metar?.visib)) || null;
      const category = decodeFlightCategory(visibilitySm, null);
      const wind =
        metar?.wdir !== undefined && metar?.wspd !== undefined
          ? `${metar.wdir}/${metar.wspd}KT`
          : "—";

      return {
        icao,
        found: Boolean(airport),
        city: airport?.city ?? null,
        country: airport?.country ?? null,
        category,
        wind,
        windGustKt: metar?.wgst ?? null,
        tempC: metar?.temp ?? null,
        dewpointC: metar?.dewp ?? null,
        visibilitySm,
        altimeterInHg: metar?.altim ?? null,
        observedAt: metar?.reportTime ?? null,
        rawMetar: metar?.rawOb ?? null,
        rawTaf,
        error: null as string | null,
      };
    })
  );

  return NextResponse.json({ success: true, results, timestamp: new Date().toISOString() });
}
