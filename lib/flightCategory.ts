// lib/flightCategory.ts
// Pure logic only — no fetch, no server-only APIs. Safe to import from both
// Server and Client Components (unlike lib/aviation.ts, which touches NOAA
// directly and must stay server-only).

export type FlightCategory = "VFR" | "MVFR" | "IFR" | "LIFR" | "UNKNOWN";

export function decodeFlightCategory(
  visibilitySm: number | null,
  ceilingFt: number | null
): FlightCategory {
  if (visibilitySm === null && ceilingFt === null) return "UNKNOWN";
  const vis = visibilitySm ?? 99;
  const ceil = ceilingFt ?? 99999;

  if (vis < 1 || ceil < 500) return "LIFR";
  if (vis < 3 || ceil < 1000) return "IFR";
  if (vis <= 5 || ceil <= 3000) return "MVFR";
  return "VFR";
}
