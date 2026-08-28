// components/FlightBoardSearch.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Loader2, X, Wind, Eye, Thermometer, Gauge } from "lucide-react";
import type { FlightCategory } from "@/lib/flightCategory";
import FlightCategoryBadge from "./FlightCategoryBadge";

type BoardResult = {
  icao: string;
  found: boolean;
  city: string | null;
  country: string | null;
  category: FlightCategory;
  wind: string;
  windGustKt: number | null;
  tempC: number | null;
  dewpointC: number | null;
  visibilitySm: number | null;
  altimeterInHg: number | null;
  observedAt: string | null;
  rawMetar: string | null;
  rawTaf: string | null;
  error: string | null;
};

const EXAMPLE_CODES = ["OPKC", "EGLL", "KJFK", "OMDB"];

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wind;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={18} className="text-data-text shrink-0" />
      <div className="flex flex-col leading-tight gap-0.5">
        <span className="text-label-caps text-data-text">{label}</span>
        <span className="text-data-mono-lg font-mono text-on-surface">{value}</span>
      </div>
    </div>
  );
}

export default function FlightBoardSearch({
  variant = "compact",
}: {
  variant?: "compact" | "detailed";
}) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<BoardResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(codesInput: string) {
    const codes = codesInput.trim();
    if (!codes) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/metar/batch?icaos=${encodeURIComponent(codes)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to fetch conditions.");
        setResults([]);
        return;
      }
      setResults(data.results);
    } catch {
      setError("Failed to reach the weather endpoint.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(input);
  }

  function loadExamples() {
    const codes = EXAMPLE_CODES.join(", ");
    setInput(codes);
    runSearch(codes);
  }

  return (
    <div className="flex flex-col gap-4 max-w-content mx-auto w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-data-text pointer-events-none"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter ICAO codes — e.g. OPKC, EGLL, KJFK"
            className="w-full bg-surface-card border border-border-subtle rounded-lg pl-10 pr-10 py-3
                       text-on-surface text-body-lg placeholder:text-data-text
                       focus:outline-none focus:border-primary transition-colors"
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setResults([]);
                setError(null);
              }}
              aria-label="Clear"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-data-text hover:text-on-surface transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary text-surface-base font-semibold rounded-lg px-6 py-3
                     hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          Check Conditions
        </button>
      </form>

      <p className="text-body-sm text-data-text">
        Separate multiple codes with commas or spaces — up to 12 at once.{" "}
        <button onClick={loadExamples} className="text-primary hover:underline">
          Try an example
        </button>
      </p>

      {error && (
        <div className="bg-surface-card border border-error/40 rounded-lg p-container-padding text-body-sm text-error">
          {error}
        </div>
      )}

      {!error && results.length === 0 && !loading && (
        <div className="bg-surface-card border border-border-subtle border-dashed rounded-lg p-8 text-center text-body-sm text-data-text">
          Enter one or more airport ICAO codes above to see live conditions.
        </div>
      )}

      {/* COMPACT — small board-style cards, used on the homepage */}
      {variant === "compact" && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {results.map((r) =>
            r.found ? (
              <Link
                key={r.icao}
                href={`/airport/${r.icao}`}
                className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-headline-md text-on-surface font-bold">{r.icao}</span>
                  <FlightCategoryBadge category={r.category} />
                </div>
                <span className="text-data-text text-body-sm">
                  {r.city ?? ""}
                  {r.city && r.country ? ", " : ""}
                  {r.country ?? ""}
                </span>
                <span className="font-mono text-data-mono text-on-surface mt-1">{r.wind}</span>
              </Link>
            ) : (
              <div
                key={r.icao}
                className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2 opacity-60"
              >
                <span className="text-headline-md text-on-surface font-bold">{r.icao}</span>
                <span className="text-body-sm text-data-text">Airport not found</span>
              </div>
            )
          )}
        </div>
      )}

      {/* DETAILED — full METAR data grid, used on /weather. No VFR/IFR badge —
          raw numbers only, matching what a dispatcher would actually read off a METAR. */}
      {variant === "detailed" && results.length > 0 && (
        <div className="flex flex-col gap-3">
          {results.map((r) =>
            r.found ? (
              <div
                key={r.icao}
                className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-4"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <Link
                      href={`/airport/${r.icao}`}
                      className="text-headline-lg text-on-surface font-bold hover:text-primary transition-colors"
                    >
                      {r.icao}
                    </Link>
                    <p className="text-body-md text-data-text">
                      {r.city ?? ""}
                      {r.city && r.country ? ", " : ""}
                      {r.country ?? ""}
                    </p>
                  </div>
                  {r.observedAt && (
                    <span className="text-body-md text-data-text">Observed {r.observedAt}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-label-caps text-data-text">METAR</span>
                  {r.rawMetar ? (
                    <div className="bg-surface-container-high border-l-2 border-primary rounded px-3 py-2.5 font-mono text-data-mono-lg text-on-surface overflow-x-auto whitespace-nowrap">
                      {r.rawMetar}
                    </div>
                  ) : (
                    <div className="text-body-md text-data-text italic">
                      No current METAR available for this airport.
                    </div>
                  )}
                </div>

                {r.rawTaf && (
                  <div className="flex flex-col gap-2">
                    <span className="text-label-caps text-data-text">TAF</span>
                    <div className="bg-surface-container-high border-l-2 border-tertiary rounded px-3 py-2.5 font-mono text-data-mono-lg text-on-surface overflow-x-auto whitespace-pre-wrap">
                      {r.rawTaf}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatBlock
                    icon={Wind}
                    label="Wind"
                    value={r.windGustKt ? `${r.wind}, gust ${r.windGustKt}kt` : r.wind}
                  />
                  <StatBlock
                    icon={Eye}
                    label="Visibility"
                    value={r.visibilitySm !== null ? `${r.visibilitySm} sm` : "—"}
                  />
                  <StatBlock
                    icon={Thermometer}
                    label="Temp / Dew Point"
                    value={
                      r.tempC !== null
                        ? `${r.tempC}°C / ${r.dewpointC ?? "—"}°C`
                        : "—"
                    }
                  />
                  <StatBlock
                    icon={Gauge}
                    label="Altimeter"
                    value={r.altimeterInHg !== null ? `${r.altimeterInHg} inHg` : "—"}
                  />
                </div>
              </div>
            ) : (
              <div
                key={r.icao}
                className="bg-surface-card border border-border-subtle rounded-lg p-container-padding opacity-60"
              >
                <span className="text-headline-md text-on-surface font-bold">{r.icao}</span>
                <span className="text-body-sm text-data-text ml-3">Airport not found</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
