// components/NatTrackCard.tsx
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { NatTrackMessage } from "@/lib/natTracks";

function formatUtc(iso: string): string {
  const d = new Date(iso);
  return d.toUTCString().replace("GMT", "UTC").slice(5); // "23 Aug 2026 01:00:00 UTC"
}

export default function NatTrackCard({ message }: { message: NatTrackMessage }) {
  const isEast = message.direction === "eastbound";

  return (
    <section className="bg-surface-card border border-border-subtle rounded-lg overflow-hidden">
      <header className="flex items-center justify-between px-container-padding py-3 bg-surface-container-high border-b border-border-subtle">
        <div className="flex items-center gap-2">
          {isEast ? (
            <ArrowRight size={18} className="text-secondary" />
          ) : (
            <ArrowLeft size={18} className="text-tertiary" />
          )}
          <span className="text-headline-md text-on-surface capitalize">
            {message.direction} OTS
          </span>
          <span className="text-label-caps text-data-text">{message.origin}</span>
        </div>
        <span className="text-body-sm text-data-text">
          {formatUtc(message.validFrom)} – {formatUtc(message.validTo)}
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="text-label-caps text-data-text text-left border-b border-border-subtle">
              <th className="px-container-padding py-2">TRK</th>
              <th className="px-container-padding py-2">Route</th>
              <th className="px-container-padding py-2">Levels</th>
              <th className="px-container-padding py-2">NAR Equiv.</th>
            </tr>
          </thead>
          <tbody>
            {message.tracks.map((track) => {
              const levels = isEast ? track.eastLevels : track.westLevels;
              return (
                <tr key={track.letter} className="border-b border-border-subtle last:border-0">
                  <td className="px-container-padding py-3 font-bold text-primary">
                    {track.letter}
                  </td>
                  <td className="px-container-padding py-3 font-mono text-data-mono text-on-surface">
                    {track.waypoints.map((w) => w.raw).join(" ")}
                  </td>
                  <td className="px-container-padding py-3 font-mono text-data-mono text-on-surface">
                    {levels.length > 0 ? `FL${levels.join(" / FL")}` : "—"}
                  </td>
                  <td className="px-container-padding py-3 text-data-text">
                    {track.narTracks.join(", ") || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {message.remarks.length > 0 && (
        <div className="px-container-padding py-3 border-t border-border-subtle bg-surface-container-lowest">
          <h4 className="text-label-caps text-data-text mb-2">Remarks</h4>
          <ul className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
            {message.remarks.map((r, i) => (
              <li key={i} className="leading-relaxed">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
