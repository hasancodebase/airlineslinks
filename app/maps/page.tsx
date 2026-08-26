// app/maps/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Navigation, Radar, Search } from "lucide-react";
import AirportSearch from "@/components/AirportSearch";

export const metadata: Metadata = {
  title: "Maps & Routes — NAT Tracks, Live Traffic | AirTech Tools",
  description:
    "North Atlantic Track data, live regional air traffic, and airport lookup — all in one place.",
};

export default function MapsPage() {
  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-3 border-b border-border-subtle pb-6">
        <h1 className="text-headline-lg text-on-surface">Maps & Routes</h1>
        <p className="text-body-sm text-data-text max-w-2xl">
          Route and traffic data by airport, track, and region. A full interactive map view is
          on the roadmap — for now, here&apos;s everything available as live data.
        </p>
        <div className="max-w-xl">
          <AirportSearch placeholder="Search Airport ICAO — e.g. KJFK, EGLL, OPKC" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/nat-tracks"
          className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2 hover:border-primary/50 transition-colors"
        >
          <Navigation className="text-primary" size={22} />
          <h2 className="text-headline-md text-on-surface">North Atlantic Tracks</h2>
          <p className="text-body-sm text-data-text">
            Today&apos;s eastbound/westbound NAT-OTS routes, waypoints, and flight levels —
            sourced directly from the FAA feed.
          </p>
        </Link>

        <Link
          href="/tools/live-traffic"
          className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2 hover:border-primary/50 transition-colors"
        >
          <Radar className="text-primary" size={22} />
          <h2 className="text-headline-md text-on-surface">Live Traffic Tracker</h2>
          <p className="text-body-sm text-data-text">
            Real-time aircraft positions by region — callsign, altitude, speed, and track,
            powered by OpenSky Network.
          </p>
        </Link>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2 opacity-60">
          <Search className="text-primary" size={22} />
          <h2 className="text-headline-md text-on-surface">Interactive Route Map</h2>
          <p className="text-body-sm text-data-text">
            A visual map view plotting airports, tracks, and live traffic together — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
