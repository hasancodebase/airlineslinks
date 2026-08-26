// app/tools/live-traffic/LiveTrafficClient.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RefreshCw, Map as MapIcon, Table as TableIcon } from "lucide-react";

// Leaflet touches `window` at import time, so it must never run during SSR.
const LiveTrafficMap = dynamic(() => import("@/components/LiveTrafficMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-lg border border-border-subtle bg-surface-card flex items-center justify-center text-body-sm text-data-text">
      Loading map…
    </div>
  ),
});

type AircraftState = {
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

type Region = {
  label: string;
  bbox: { lamin: number; lomin: number; lamax: number; lomax: number };
};

const REGIONS: Region[] = [
  { label: "Pakistan / Gulf", bbox: { lamin: 20, lomin: 55, lamax: 33, lomax: 78 } },
  { label: "Western Europe", bbox: { lamin: 43, lomin: -10, lamax: 58, lomax: 15 } },
  { label: "US East Coast", bbox: { lamin: 25, lomin: -85, lamax: 45, lomax: -65 } },
  { label: "SE Asia", bbox: { lamin: -10, lomin: 95, lamax: 20, lomax: 120 } },
];

const POLL_INTERVAL_MS = 15_000;

function fmtAltitude(m: number | null): string {
  if (m === null) return "—";
  const ft = m * 3.28084;
  return `${Math.round(ft).toLocaleString()} ft`;
}

function fmtSpeed(ms: number | null): string {
  if (ms === null) return "—";
  const kt = ms * 1.94384;
  return `${Math.round(kt)} kt`;
}

export default function LiveTrafficClient() {
  const [regionIndex, setRegionIndex] = useState(0);
  const [states, setStates] = useState<AircraftState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [view, setView] = useState<"table" | "map">("map");

  const region = REGIONS[regionIndex];
  const mapCenter: [number, number] = [
    (region.bbox.lamin + region.bbox.lamax) / 2,
    (region.bbox.lomin + region.bbox.lomax) / 2,
  ];

  const fetchStates = useCallback(async () => {
    const { lamin, lomin, lamax, lomax } = region.bbox;
    const params = new URLSearchParams({
      lamin: String(lamin),
      lomin: String(lomin),
      lamax: String(lamax),
      lomax: String(lomax),
    });
    try {
      const res = await fetch(`/api/opensky?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to load live traffic.");
        setStates([]);
        return;
      }
      setError(null);
      setStates(data.states ?? []);
      setLastUpdated(new Date());
    } catch {
      setError("Failed to reach the live traffic endpoint.");
    } finally {
      setLoading(false);
    }
  }, [region]);

  useEffect(() => {
    setLoading(true);
    fetchStates();
    const interval = setInterval(fetchStates, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStates]);

  const airborne = states.filter((s) => !s.onGround && s.callsign);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {REGIONS.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setRegionIndex(i)}
            className={`text-body-sm rounded-full px-3 py-1.5 transition-colors ${
              i === regionIndex
                ? "bg-primary text-surface-base"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-bright"
            }`}
          >
            {r.label}
          </button>
        ))}
        <button
          onClick={() => {
            setLoading(true);
            fetchStates();
          }}
          className="flex items-center gap-1.5 text-body-sm text-data-text hover:text-primary transition-colors"
          aria-label="Refresh now"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading…"}
        </button>

        <div className="ml-auto flex items-center gap-1 bg-surface-container-high rounded-full p-1">
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 text-body-sm rounded-full px-3 py-1 transition-colors ${
              view === "map" ? "bg-primary text-surface-base" : "text-on-surface-variant"
            }`}
          >
            <MapIcon size={14} /> Map
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 text-body-sm rounded-full px-3 py-1 transition-colors ${
              view === "table" ? "bg-primary text-surface-base" : "text-on-surface-variant"
            }`}
          >
            <TableIcon size={14} /> Table
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-surface-card border border-error/40 rounded-lg p-container-padding text-body-sm text-error">
          {error}
        </div>
      )}

      {!error && view === "map" && <LiveTrafficMap states={airborne} center={mapCenter} />}

      {!error && view === "table" && (
        <div className="overflow-x-auto border border-border-subtle rounded-lg">
          <table className="w-full text-body-sm text-left">
            <thead className="bg-surface-container-high text-label-caps text-data-text">
              <tr>
                <th className="px-3 py-2">Callsign</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Altitude</th>
                <th className="px-3 py-2">Speed</th>
                <th className="px-3 py-2">Track</th>
              </tr>
            </thead>
            <tbody>
              {airborne.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-data-text">
                    No airborne traffic with a callsign in this region right now.
                  </td>
                </tr>
              )}
              {airborne.slice(0, 50).map((s) => (
                <tr key={s.icao24} className="border-t border-border-subtle">
                  <td className="px-3 py-2 font-mono text-on-surface">{s.callsign}</td>
                  <td className="px-3 py-2 text-on-surface-variant">{s.originCountry}</td>
                  <td className="px-3 py-2 font-mono text-on-surface">
                    {fmtAltitude(s.baroAltitudeM)}
                  </td>
                  <td className="px-3 py-2 font-mono text-on-surface">
                    {fmtSpeed(s.velocityMs)}
                  </td>
                  <td className="px-3 py-2 font-mono text-on-surface">
                    {s.trueTrackDeg !== null ? `${Math.round(s.trueTrackDeg)}°` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-body-sm text-data-text">
        Showing up to 50 airborne aircraft with an active callsign. Data from OpenSky Network,
        refreshed every 15 seconds. Positions are ADS-B/Mode-S reports and may lag live position
        by a few seconds.
      </p>
    </div>
  );
}
