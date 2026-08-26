// components/MetarCard.tsx
"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import type { Metar } from "@/lib/aviation";
import { decodeFlightCategory } from "@/lib/aviation";
import FlightCategoryBadge from "./FlightCategoryBadge";

function minutesAgo(obsTime?: number): string {
  if (!obsTime) return "—";
  const diffMs = Date.now() - obsTime * 1000;
  const mins = Math.max(0, Math.round(diffMs / 60000));
  return mins <= 1 ? "just now" : `${mins} mins ago`;
}

function parseCloudCeiling(metar: Metar): number | null {
  // clouds field shape varies by NOAA response; guard defensively
  const clouds = metar["clouds"];
  if (!Array.isArray(clouds)) return null;
  const broken = clouds.find(
    (c: { cover?: string; base?: number }) => c.cover === "BKN" || c.cover === "OVC"
  );
  return broken?.base ?? null;
}

export default function MetarCard({ metar }: { metar: Metar | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!metar || !metar.rawOb) {
    return (
      <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding text-data-text text-body-sm">
        No current METAR available for this airport.
      </div>
    );
  }

  const visibilitySm =
    typeof metar.visib === "number" ? metar.visib : parseFloat(String(metar.visib)) || null;
  const ceiling = parseCloudCeiling(metar);
  const category = decodeFlightCategory(visibilitySm, ceiling);

  const wind =
    metar.wdir !== undefined && metar.wspd !== undefined
      ? `${metar.wdir}° @ ${metar.wspd}${metar.wgst ? `G${metar.wgst}` : ""} KT`
      : "—";

  const handleCopy = async () => {
    if (!metar.rawOb) return;
    await navigator.clipboard.writeText(metar.rawOb);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-headline-md text-on-surface flex items-center gap-2">
          Current Conditions
          <FlightCategoryBadge category={category} />
        </h3>
        <span className="text-data-text text-body-sm flex items-center gap-1">
          <RefreshCw size={13} />
          Observed {minutesAgo(metar.obsTime)}
        </span>
      </div>

      {/* Raw METAR box — severity-colored side border per DESIGN.md */}
      <div className="relative group bg-surface-container-highest border-l-4 border-secondary-container rounded-r p-container-padding">
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="absolute top-2 right-2 p-1.5 rounded bg-surface-bright text-data-text opacity-0
                     group-hover:opacity-100 hover:text-primary transition-all border border-border-subtle
                     flex items-center justify-center"
        >
          {copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}
        </button>
        <code className="font-mono text-data-mono text-on-surface block pr-10 whitespace-pre-wrap leading-relaxed">
          {metar.rawOb}
        </code>
      </div>

      {/* Parsed quick-view grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-unit">
        <DataTile label="WIND" value={wind} />
        <DataTile label="VISIBILITY" value={visibilitySm !== null ? `${visibilitySm} SM` : "—"} />
        <DataTile label="CLOUDS" value={ceiling !== null ? `${ceiling.toLocaleString()} FT` : "—"} />
        <DataTile
          label="ALTIMETER"
          value={metar.altim !== undefined ? `${(metar.altim / 33.8639).toFixed(2)} inHg` : "—"}
        />
      </div>
    </section>
  );
}

function DataTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-card border border-border-subtle p-3 rounded flex flex-col gap-1">
      <span className="text-label-caps text-data-text">{label}</span>
      <span className="font-mono text-data-mono text-on-surface">{value}</span>
    </div>
  );
}
