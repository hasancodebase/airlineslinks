// components/RunwayCard.tsx
import { ArrowUpRight, ArrowLeftRight } from "lucide-react";
import type { Runway } from "@/lib/airports";

export default function RunwayCard({ runway, isPrimary }: { runway: Runway; isPrimary?: boolean }) {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-surface-bright" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-headline-md font-bold ${isPrimary ? "text-primary" : "text-on-surface"}`}>
            {runway.ident}
          </span>
          {isPrimary && (
            <span className="px-1.5 py-0.5 rounded bg-surface-bright border border-border-subtle text-[9px] font-bold uppercase tracking-wide text-data-text">
              PRIMARY
            </span>
          )}
        </div>
        {isPrimary ? (
          <ArrowUpRight size={20} className="text-secondary" aria-label="Favorable wind" />
        ) : (
          <ArrowLeftRight size={20} className="text-danger-critical" aria-label="Crosswind component high" />
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-border-subtle pt-2">
        <div className="flex flex-col">
          <span className="text-label-caps text-data-text">LENGTH</span>
          <span className="font-mono text-[13px] text-on-surface">
            {runway.lengthFt ? `${runway.lengthFt.toLocaleString()} ft` : "—"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-label-caps text-data-text">WIDTH</span>
          <span className="font-mono text-[13px] text-on-surface">
            {runway.widthFt ? `${runway.widthFt} ft` : "—"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-label-caps text-data-text">SURFACE</span>
          <span className="text-[12px] text-on-surface">{runway.surface ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
