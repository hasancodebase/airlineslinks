// app/weather/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import AirportSearch from "@/components/AirportSearch";
import FlightCategoryBadge from "@/components/FlightCategoryBadge";
import LiveFlightBoard from "@/components/LiveFlightBoard";

export const metadata: Metadata = {
  title: "Aviation Weather — METAR & TAF Lookup | AirTech Tools",
  description:
    "Search any airport for live METAR, TAF, and flight category (VFR/MVFR/IFR/LIFR) conditions. Free, direct from NOAA.",
};

const CATEGORIES = [
  {
    code: "VFR" as const,
    name: "Visual Flight Rules",
    rule: "Ceiling > 3,000 ft AGL and visibility > 5 sm",
  },
  {
    code: "MVFR" as const,
    name: "Marginal VFR",
    rule: "Ceiling 1,000–3,000 ft AGL and/or visibility 3–5 sm",
  },
  {
    code: "IFR" as const,
    name: "Instrument Flight Rules",
    rule: "Ceiling 500–1,000 ft AGL and/or visibility 1–3 sm",
  },
  {
    code: "LIFR" as const,
    name: "Low IFR",
    rule: "Ceiling < 500 ft AGL and/or visibility < 1 sm",
  },
];

export default function WeatherPage() {
  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-3 border-b border-border-subtle pb-6">
        <h1 className="text-headline-lg text-on-surface">Weather</h1>
        <p className="text-body-sm text-data-text max-w-2xl">
          Search any airport for live METAR, TAF, and NOTAM data, sourced directly from NOAA.
        </p>
        <div className="max-w-xl">
          <AirportSearch placeholder="Search Airport ICAO — e.g. KJFK, EGLL, OPKC" />
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-md text-on-surface">Flight Category Legend</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.code}
              className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex items-start gap-3"
            >
              <FlightCategoryBadge category={c.code} />
              <div className="flex flex-col gap-0.5">
                <span className="text-body-md text-on-surface font-semibold">{c.name}</span>
                <span className="text-body-sm text-data-text">{c.rule}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-md text-on-surface">Live Conditions Snapshot</h2>
        <Suspense
          fallback={<p className="text-body-sm text-data-text">Loading live conditions…</p>}
        >
          <LiveFlightBoard />
        </Suspense>
      </section>
    </div>
  );
}
