// app/nat-tracks/page.tsx
import type { Metadata } from "next";
import { fetchNatTracks, type NatTrackMessage } from "@/lib/natTracks";
import NatTrackCard from "@/components/NatTrackCard";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Today's North Atlantic Tracks (NAT-OTS) | AirTech Tools",
  description:
    "Live North Atlantic organized track system (NAT-OTS) — eastbound and westbound tracks, waypoints, flight levels, and remarks, sourced directly from the FAA NAT track feed. Free, updated twice daily.",
};

export default async function NatTracksPage() {
  let messages: NatTrackMessage[];
  let error: string | null = null;

  try {
    messages = await fetchNatTracks();
  } catch (err) {
    messages = [];
    error = err instanceof Error ? err.message : "Failed to load NAT tracks";
  }

  const eastbound = messages.filter((m) => m.direction === "eastbound");
  const westbound = messages.filter((m) => m.direction === "westbound");
  const other = messages.filter((m) => m.direction === "unknown");

  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-1 border-b border-border-subtle pb-4">
        <h1 className="text-headline-lg text-on-surface">North Atlantic Tracks (NAT-OTS)</h1>
        <p className="text-body-sm text-data-text">
          Sourced directly from the FAA NAT track feed. Published twice daily — eastbound
          (~1400Z) and westbound (~2200Z). Always cross-check against the official NOTAM before
          flight planning.
        </p>
      </header>

      {error && (
        <div className="bg-error-container/20 border border-error/30 text-on-error-container rounded-lg p-container-padding text-body-sm">
          Couldn&apos;t load live NAT tracks right now: {error}. Try refreshing in a few minutes.
        </div>
      )}

      {!error && messages.length === 0 && (
        <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding text-data-text text-body-sm">
          No active NAT track messages found.
        </div>
      )}

      {eastbound.length > 0 && (
        <div className="flex flex-col gap-4">
          {eastbound.map((m) => (
            <NatTrackCard key={m.origin + m.validFrom} message={m} />
          ))}
        </div>
      )}

      {westbound.length > 0 && (
        <div className="flex flex-col gap-4">
          {westbound.map((m) => (
            <NatTrackCard key={m.origin + m.validFrom} message={m} />
          ))}
        </div>
      )}

      {other.map((m) => (
        <NatTrackCard key={m.origin + m.validFrom} message={m} />
      ))}
    </div>
  );
}
