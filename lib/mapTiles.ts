// lib/mapTiles.ts — shared basemap tile config for all Leaflet maps.
// CARTO now requires a free API key for their raster basemap tiles
// (changed ~Aug 2026 — previously key-less). Get a free key (5M
// requests/month) at https://carto.com/basemaps/apikey — only enable
// "Maps API" on the token, nothing else. This key is meant to be used
// directly in client-side tile URLs (CARTO's own docs do this), so it's
// exposed via NEXT_PUBLIC_ rather than kept server-only.
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY;

export const DARK_TILE_URL = CARTO_KEY
  ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`
  : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"; // will show watermark until key is set

export const DARK_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
