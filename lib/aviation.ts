// lib/aviation.ts — SERVER ONLY. Never import this into a Client Component:
// NOAA's aviationweather.gov does not send CORS headers, so these calls
// must happen inside app/api/* route handlers (or Server Components), not the browser.

const NOAA_BASE = "https://aviationweather.gov/api/data";

function assertIcao(icao: string): string {
  const value = icao.trim().toUpperCase();
  if (!/^[A-Z0-9]{4}$/.test(value)) {
    throw new Error(`Invalid ICAO code: "${icao}"`);
  }
  return value;
}

async function fetchJson<T>(
  url: string,
  init: RequestInit = {},
  revalidateSeconds = 300
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      // NOAA asks API consumers to identify themselves — update the domain
      // once you've decided subdomain vs standalone.
      "User-Agent": "airlineslinks.vercel.app aviation-tools (contact: you@example.com)",
      ...init.headers,
    },
    next: { revalidate: revalidateSeconds },
  });

  if (response.status === 204) {
    return [] as unknown as T;
  }
  if (!response.ok) {
    throw new Error(`API error ${response.status} for ${url}`);
  }
  return response.json() as Promise<T>;
}

export type Metar = {
  icaoId?: string;
  receiptTime?: string;
  obsTime?: number;
  reportTime?: string;
  rawOb?: string;
  temp?: number;
  dewp?: number;
  wdir?: number | string;
  wspd?: number;
  wgst?: number;
  visib?: number | string;
  altim?: number;
  metarType?: string;
  [key: string]: unknown;
};

export async function fetchMetar(icao: string): Promise<Metar[]> {
  const id = assertIcao(icao);
  const url = new URL(`${NOAA_BASE}/metar`);
  url.searchParams.set("ids", id);
  url.searchParams.set("format", "json");
  // METAR updates hourly (more often at busy fields) — 60s revalidate keeps it fresh
  // without hammering NOAA on every request.
  return fetchJson<Metar[]>(url.toString(), {}, 60);
}

export type Taf = {
  icaoId?: string;
  rawTAF?: string;
  issueTime?: string;
  validTimeFrom?: number;
  validTimeTo?: number;
  [key: string]: unknown;
};

export async function fetchTaf(icao: string): Promise<Taf[]> {
  const id = assertIcao(icao);
  const url = new URL(`${NOAA_BASE}/taf`);
  url.searchParams.set("ids", id);
  url.searchParams.set("format", "json");
  return fetchJson<Taf[]>(url.toString(), {}, 300);
}

export type SunTimes = {
  results?: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    day_length: number;
    civil_twilight_begin: string;
    civil_twilight_end: string;
  };
  status?: string;
};

export async function fetchSunTimes(lat: number, lon: number): Promise<SunTimes> {
  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
  return fetchJson<SunTimes>(url, {}, 86400);
}

export type Notam = {
  icao?: string;
  number?: string;
  text?: string;
  effectiveStart?: string;
  effectiveEnd?: string;
  [key: string]: unknown;
};

/**
 * NOTAM adapter. FAA's real NOTAM API requires SWIM credentials (account-based,
 * not a quick signup) — see the V2 spec's API table. For MVP this hits the
 * unofficial AviationAPI fallback and degrades to an empty array on any failure,
 * so a broken/rate-limited NOTAM source never takes down the airport page.
 *
 * IMPORTANT: verify aviationapi.com/v1/notams is still live and check its ToS
 * before relying on it in production — unofficial free aviation APIs go dark
 * or change shape without notice.
 */
export async function fetchNotams(icao: string): Promise<Notam[]> {
  try {
    const id = assertIcao(icao);
    const url = `https://docs.aviationapi.com/v1/notams?icao=${id}`;
    const data = await fetchJson<Notam[] | { [key: string]: Notam[] }>(url, {}, 300);
    // AviationAPI's shape isn't 100% confirmed — normalize defensively.
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      const values = Object.values(data).flat();
      return values as Notam[];
    }
    return [];
  } catch {
    return [];
  }
}

export function distanceKm(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): number {
  const R = 6371.0088;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(toLat - fromLat);
  const dLon = toRad(toLon - fromLon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Decodes flight category from visibility (statute miles) and ceiling (ft AGL). */
export function decodeFlightCategory(
  visibilitySm: number | null,
  ceilingFt: number | null
): "VFR" | "MVFR" | "IFR" | "LIFR" | "UNKNOWN" {
  if (visibilitySm === null && ceilingFt === null) return "UNKNOWN";
  const vis = visibilitySm ?? 99;
  const ceil = ceilingFt ?? 99999;

  if (vis < 1 || ceil < 500) return "LIFR";
  if (vis < 3 || ceil < 1000) return "IFR";
  if (vis <= 5 || ceil <= 3000) return "MVFR";
  return "VFR";
}
