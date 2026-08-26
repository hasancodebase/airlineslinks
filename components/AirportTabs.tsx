// components/AirportTabs.tsx
"use client";

import { cn } from "@/lib/utils";

const TABS = ["METAR", "TAF", "NOTAMs", "Runways"] as const;
export type AirportTab = (typeof TABS)[number];

export default function AirportTabs({
  active,
  onChange,
}: {
  active: AirportTab;
  onChange: (tab: AirportTab) => void;
}) {
  return (
    <nav className="flex items-center gap-6 border-b border-border-subtle overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "pb-3 border-b-2 text-[14px] leading-tight whitespace-nowrap transition-colors",
            active === tab
              ? "border-primary-container text-primary font-semibold"
              : "border-transparent text-data-text hover:text-on-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
