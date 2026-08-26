// app/weather/page.tsx
import type { Metadata } from "next";
import FlightBoardSearch from "@/components/FlightBoardSearch";

export const metadata: Metadata = {
  title: "Aviation Weather — Live METAR Lookup | AirTech Tools",
  description:
    "Search any airport, or several at once, for live METAR conditions — wind, visibility, temperature, and altimeter. Free, direct from NOAA.",
};

export default function WeatherPage() {
  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-1 border-b border-border-subtle pb-6">
        <h1 className="text-headline-lg text-on-surface">Weather</h1>
        <p className="text-body-md text-data-text max-w-2xl">
          Live METAR conditions for any airport, or several at once — sourced directly from NOAA.
        </p>
      </header>

      <FlightBoardSearch variant="detailed" />
    </div>
  );
}
