// app/weather/page.tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import FlightBoardSearch from "@/components/FlightBoardSearch";

const RadarMap = dynamic(() => import("@/components/RadarMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-lg border border-border-subtle bg-surface-card flex items-center justify-center text-body-sm text-data-text">
      Loading radar…
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Aviation Weather — Live METAR, TAF & Radar | AirTech Tools",
  description:
    "Search any airport, or several at once, for live METAR and TAF conditions, plus a live rain radar loop. Free, direct from NOAA and RainViewer.",
};

export default function WeatherPage() {
  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-1 border-b border-border-subtle pb-6">
        <h1 className="text-headline-lg text-on-surface">Weather</h1>
        <p className="text-body-md text-data-text max-w-2xl">
          Live METAR and TAF for any airport, or several at once, plus a live radar loop —
          sourced directly from NOAA and RainViewer.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
        <FlightBoardSearch variant="detailed" />
        <div className="lg:sticky lg:top-20">
          <h2 className="text-headline-md text-on-surface mb-3">Live Radar</h2>
          <RadarMap />
        </div>
      </div>
    </div>
  );
}
