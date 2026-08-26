// components/TafCard.tsx
import type { Taf } from "@/lib/aviation";

export default function TafCard({ taf }: { taf: Taf | undefined }) {
  if (!taf || !taf.rawTAF) {
    return (
      <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding text-data-text text-body-sm">
        No current TAF available for this airport.
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-headline-md text-on-surface">Terminal Aerodrome Forecast</h3>
      <div className="relative bg-surface-container-highest border-l-4 border-tertiary-container rounded-r p-container-padding">
        <code className="font-mono text-data-mono text-on-surface block whitespace-pre-wrap leading-relaxed">
          {taf.rawTAF}
        </code>
      </div>
      {taf.issueTime && (
        <span className="text-data-text text-body-sm">
          Issued: {new Date(taf.issueTime).toUTCString()}
        </span>
      )}
    </section>
  );
}
