// lib/opensky.ts — SERVER ONLY. Requires OPENSKY_CLIENT_ID / OPENSKY_CLIENT_SECRET.
// Free tier: register a free account at https://opensky-network.org, then create
// an API client under your account settings to get a client_id/client_secret pair.
// Free tier gives ~4000 credits/day authenticated — plenty for a low-traffic tool
// polling every 15-30s for one region at a time.

const TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";
const STATES_URL = "https://opensky-network.org/api/states/all";

export type AircraftState = {
  icao24: string;
  callsign: string | null;
  originCountry: string;
  longitude: number | null;
  latitude: number | null;
  baroAltitudeM: number | null;
  onGround: boolean;
  velocityMs: number | null;
  trueTrackDeg: number | null;
  verticalRateMs: number | null;
};

export type Bbox = { lamin: number; lomin: number; lamax: number; lomax: number };

// In-memory token cache. Fine for a single Node.js server process; if you scale
// to multiple serverless instances each will fetch its own token independently,
// which is still well within free-tier rate limits for this use case.
let cachedToken: { value: string; expiresAt: number } | null = null;

export function isOpenSkyConfigured(): boolean {
  return Boolean(process.env.OPENSKY_CLIENT_ID && process.env.OPENSKY_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 10_000) {
    return cachedToken.value;
  }

  const clientId = process.env.OPENSKY_CLIENT_ID;
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "OpenSky credentials not configured. Set OPENSKY_CLIENT_ID and OPENSKY_CLIENT_SECRET in .env.local."
    );
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OpenSky token request failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

export async function fetchStatesInBbox(bbox: Bbox): Promise<AircraftState[]> {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    lamin: String(bbox.lamin),
    lomin: String(bbox.lomin),
    lamax: String(bbox.lamax),
    lomax: String(bbox.lomax),
  });

  const response = await fetch(`${STATES_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    // OpenSky data refreshes roughly every 5-10s server-side; polling more often
    // than that just burns credits without new data.
    next: { revalidate: 10 },
  });

  if (!response.ok) {
    throw new Error(`OpenSky states request failed: ${response.status}`);
  }

  const data = (await response.json()) as { time: number; states: unknown[][] | null };

  if (!data.states) return [];

  // OpenSky returns each state as a fixed-position array, not an object.
  // Index reference: https://openskynetwork.github.io/opensky-api/rest.html#response
  return data.states.map((s) => ({
    icao24: String(s[0]),
    callsign: s[1] ? String(s[1]).trim() || null : null,
    originCountry: String(s[2]),
    longitude: s[5] === null ? null : Number(s[5]),
    latitude: s[6] === null ? null : Number(s[6]),
    baroAltitudeM: s[7] === null ? null : Number(s[7]),
    onGround: Boolean(s[8]),
    velocityMs: s[9] === null ? null : Number(s[9]),
    trueTrackDeg: s[10] === null ? null : Number(s[10]),
    verticalRateMs: s[11] === null ? null : Number(s[11]),
  }));
}
