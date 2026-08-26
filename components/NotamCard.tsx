// components/NotamCard.tsx
import { AlertTriangle } from "lucide-react";
import type { Notam } from "@/lib/aviation";

export default function NotamList({ notams }: { notams: Notam[] }) {
  if (notams.length === 0) {
    return (
      <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding text-data-text text-body-sm">
        No active NOTAMs found for this airport, or the NOTAM source is temporarily unavailable.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notams.map((notam, i) => (
        <div
          key={notam.number ?? i}
          className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex gap-3"
        >
          <AlertTriangle size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            {notam.number && (
              <span className="text-label-caps text-data-text">{notam.number}</span>
            )}
            <p className="font-mono text-data-mono text-on-surface whitespace-pre-wrap leading-relaxed">
              {notam.text ?? "No description available."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
