// lib/airports.ts — SERVER ONLY (uses Node fs, cannot run on Edge runtime)
import fs from "node:fs";
import path from "node:path";

export type Runway = {
  ident: string;
  lengthFt: number | null;
  widthFt: number | null;
  surface: string | null;
  lighted: boolean;
};

export type Frequency = {
  type: string | null;
  description: string | null;
  mhz: number | null;
};

export type Airport = {
  icao: string;
  iata: string | null;
  name: string;
  city: string | null;
  country: string;
  region: string;
  lat: number;
  lon: number;
  elevationFt: number | null;
  type: string;
  scheduledService: boolean;
  runways: Runway[];
  frequencies: Frequency[];
};

let cachedAirports: Airport[] | null = null;
let icaoIndex: Map<string, Airport> | null = null;

/**
 * Loads public/airports.json once per server process and caches it in memory.
 * Subsequent calls are just a Map lookup — no re-parsing.
 */
function loadAirports(): Airport[] {
  if (cachedAirports) return cachedAirports;

  const filePath = path.join(process.cwd(), "public", "airports.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedAirports = JSON.parse(raw) as Airport[];

  icaoIndex = new Map();
  for (const airport of cachedAirports) {
    icaoIndex.set(airport.icao, airport);
  }

  return cachedAirports;
}

export function getAirportByIcao(icao: string): Airport | null {
  loadAirports(); // ensures icaoIndex is populated
  const id = icao.trim().toUpperCase();
  return icaoIndex?.get(id) ?? null;
}

/**
 * Simple search across icao, iata, name, city.
 * Case-insensitive substring match, icao/iata exact matches ranked first.
 */
export function searchAirports(query: string, limit = 10): Airport[] {
  const airports = loadAirports();
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const exact: Airport[] = [];
  const partial: Airport[] = [];

  for (const airport of airports) {
    const icao = airport.icao.toLowerCase();
    const iata = airport.iata?.toLowerCase() ?? "";
    const name = airport.name?.toLowerCase() ?? "";
    const city = airport.city?.toLowerCase() ?? "";

    if (icao === q || iata === q) {
      exact.push(airport);
    } else if (
      icao.startsWith(q) ||
      iata.startsWith(q) ||
      name.includes(q) ||
      city.includes(q)
    ) {
      partial.push(airport);
    }

    if (exact.length + partial.length >= limit * 3) break; // early exit guard for huge datasets
  }

  return [...exact, ...partial].slice(0, limit);
}
