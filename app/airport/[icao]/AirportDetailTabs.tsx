// app/airport/[icao]/AirportDetailTabs.tsx
"use client";

import { useState } from "react";
import AirportTabs, { type AirportTab } from "@/components/AirportTabs";
import MetarCard from "@/components/MetarCard";
import TafCard from "@/components/TafCard";
import NotamList from "@/components/NotamCard";
import RunwayCard from "@/components/RunwayCard";
import type { Metar, Taf, Notam } from "@/lib/aviation";
import type { Runway } from "@/lib/airports";

export default function AirportDetailTabs({
  metar,
  taf,
  notams,
  runways,
}: {
  metar: Metar | undefined;
  taf: Taf | undefined;
  notams: Notam[];
  runways: Runway[];
}) {
  const [active, setActive] = useState<AirportTab>("METAR");

  return (
    <>
      <AirportTabs active={active} onChange={setActive} />

      <div className="mt-4">
        {active === "METAR" && <MetarCard metar={metar} />}
        {active === "TAF" && <TafCard taf={taf} />}
        {active === "NOTAMs" && <NotamList notams={notams} />}
        {active === "Runways" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {runways.length === 0 && (
              <p className="text-data-text text-body-sm">No runway data available.</p>
            )}
            {runways.map((runway, i) => (
              <RunwayCard key={runway.ident + i} runway={runway} isPrimary={i === 0} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
