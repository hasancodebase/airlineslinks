// app/airport/[icao]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getAirportByIcao } from "@/lib/airports";
import { fetchMetar, fetchTaf, fetchNotams, decodeFlightCategory } from "@/lib/aviation";
import FlightCategoryBadge from "@/components/FlightCategoryBadge";
import AirportDetailTabs from "./AirportDetailTabs";

export const revalidate = 60;

type Props = { params: { icao: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const icao = params.icao.toUpperCase();
  const airport = getAirportByIcao(icao);

  if (!airport) {
    return { title: `${icao} — Airport Not Found | AirTech Tools` };
  }

  return {
    title: `${airport.icao} METAR Live - ${airport.name} Weather, NOTAMs, Runways | AirTech Tools`,
    description: `Live METAR, TAF, NOTAMs for ${airport.icao} ${airport.name} in ${airport.city ?? airport.country}. Runway info, elevation, frequencies. 100% free.`,
  };
}

export default async function AirportDetailPage({ params }: Props) {
  const icao = params.icao.toUpperCase();
  const airport = getAirportByIcao(icao);

  if (!airport) {
    notFound();
  }

  const [metarData, tafData, notamData] = await Promise.all([
    fetchMetar(icao).catch(() => []),
    fetchTaf(icao).catch(() => []),
    fetchNotams(icao).catch(() => []),
  ]);

  const metar = metarData[0];
  const taf = tafData[0];

  const visibilitySm =
    typeof metar?.visib === "number" ? metar.visib : parseFloat(String(metar?.visib)) || null;
  const category = decodeFlightCategory(visibilitySm, null);

  return (
    <div className="w-full px-4 md:px-margin-page pt-6 flex flex-col gap-gutter">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-data-text hover:text-primary transition-colors w-fit text-body-sm"
      >
        <ArrowLeft size={16} />
        Back to Search
      </Link>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-headline-lg text-on-surface">{airport.icao}</h1>
            <FlightCategoryBadge category={category} />
          </div>
          <h2 className="text-body-md text-data-text">
            {airport.name}
            {airport.city ? ` • ${airport.city}, ${airport.country}` : ` • ${airport.country}`}
          </h2>
        </div>
      </header>

      <AirportDetailTabs
        metar={metar}
        taf={taf}
        notams={notamData}
        runways={airport.runways}
      />
    </div>
  );
}
