// lib/natTracks.ts — SERVER ONLY
// Parses the FAA NMS North Atlantic Track feed (unauthenticated, free, updates twice daily).
// Parser logic prototyped and verified against real feed data before porting here.

const NAT_FEED_URL = "https://nms.aim.faa.gov/datanat/nat.json";

export type NatWaypoint = {
  raw: string; // original token, e.g. "TUDEP" or "52/50"
  lat: number | null; // populated only for lat/lon-shorthand tokens (whole-degree NAT format)
  lon: number | null; // negative = west of Greenwich, which covers all current NAT tracks
};

export type NatTrack = {
  letter: string;
  waypoints: NatWaypoint[];
  eastLevels: string[];
  westLevels: string[];
  narTracks: string[];
};

export type NatTrackMessage = {
  origin: string; // ICAO of issuing OACC, e.g. CZQX (Gander), EGGX (Shanwick)
  direction: "eastbound" | "westbound" | "unknown";
  validFrom: string;
  validTo: string;
  tracks: NatTrack[];
  remarks: string[];
};

type RawNatRecord = {
  notam_number_formatted: string;
  icao_id: string;
  condition_message: string;
  start_datetime: string;
  end_datetime: string;
  part_no: number;
};

const TRACK_LINE_RE = /^([A-Z])\s+((?:[A-Z0-9/]+\s*)+)$/;
const LATLON_RE = /^(\d{2})\/(\d{2})$/;

function parseLatLonToken(token: string): NatWaypoint {
  const match = token.match(LATLON_RE);
  if (match) {
    const lat = parseInt(match[1], 10);
    const lon = -parseInt(match[2], 10); // NAT tracks are always west of Greenwich currently
    return { raw: token, lat, lon };
  }
  return { raw: token, lat: null, lon: null }; // named fix — no coordinates without a nav database
}

function parseGroup(records: RawNatRecord[]): NatTrackMessage {
  const sorted = [...records].sort((a, b) => a.part_no - b.part_no);
  const fullText = sorted.map((r) => r.condition_message).join("\n");
  const lines = fullText
    .split(/\r\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const origin = sorted[0].icao_id;
  const validFrom = sorted[0].start_datetime;
  const validTo = sorted[0].end_datetime;

  const tracks: NatTrack[] = [];
  let current: NatTrack | null = null;
  let inRemarks = false;
  const remarks: string[] = [];

  for (const line of lines) {
    if (line.startsWith("REMARKS")) {
      inRemarks = true;
      continue;
    }
    if (line.startsWith("END OF PART")) {
      continue;
    }
    if (inRemarks) {
      remarks.push(line);
      continue;
    }

    const trackMatch = line.match(TRACK_LINE_RE);
    if (trackMatch && trackMatch[1].length === 1) {
      const letter = trackMatch[1];
      const tokens = trackMatch[2].trim().split(/\s+/);
      current = {
        letter,
        waypoints: tokens.map(parseLatLonToken),
        eastLevels: [],
        westLevels: [],
        narTracks: [],
      };
      tracks.push(current);
      continue;
    }

    if (current) {
      if (line.startsWith("EAST LVLS")) {
        const rest = line.replace("EAST LVLS", "").trim();
        current.eastLevels = rest === "NIL" ? [] : rest.split(/\s+/);
      } else if (line.startsWith("WEST LVLS")) {
        const rest = line.replace("WEST LVLS", "").trim();
        current.westLevels = rest === "NIL" ? [] : rest.split(/\s+/);
      } else if (line.startsWith("NAR")) {
        current.narTracks = line
          .replace("NAR", "")
          .replace(/-$/, "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
      }
    }
  }

  const direction: NatTrackMessage["direction"] = tracks.some((t) => t.eastLevels.length > 0)
    ? "eastbound"
    : tracks.some((t) => t.westLevels.length > 0)
    ? "westbound"
    : "unknown";

  return { origin, direction, validFrom, validTo, tracks, remarks };
}

/**
 * Fetches and parses today's NAT organized tracks from the FAA feed.
 * No auth required. Tracks are published twice daily (~1400Z and ~2200Z),
 * so a multi-hour cache is safe — see revalidate value used by the caller.
 */
export async function fetchNatTracks(): Promise<NatTrackMessage[]> {
  const response = await fetch(NAT_FEED_URL, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 }, // 30 min — generous given twice-daily publication
  });

  if (!response.ok) {
    throw new Error(`NAT track feed error ${response.status}`);
  }

  const raw = (await response.json()) as RawNatRecord[];

  const groups = new Map<string, RawNatRecord[]>();
  for (const record of raw) {
    const key = record.notam_number_formatted;
    const existing = groups.get(key);
    if (existing) {
      existing.push(record);
    } else {
      groups.set(key, [record]);
    }
  }

  return Array.from(groups.values()).map(parseGroup);
}
