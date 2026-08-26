// components/LiveFlightBoard.tsx
import Link from "next/link";
import { Eye, CloudOff, CloudFog } from "lucide-react";
import { fetchMetar, decodeFlightCategory } from "@/lib/aviation";
import { getAirportByIcao } from "@/lib/airports";
import FlightCategoryBadge from "./FlightCategoryBadge";

// Showcase airports for the homepage preview — same set as the Stitch mockup.
const SHOWCASE_ICAOS = ["OPKC", "OMDB", "KJFK", "EGLL"];

export const revalidate = 300;

export default async function LiveFlightBoard() {
  const rows = await Promise.all(
    SHOWCASE_ICAOS.map(async (icao) => {
      const airport = getAirportByIcao(icao);
      const metarData = await fetchMetar(icao).catch(() => []);
      const metar = metarData[0];
      const visibilitySm =
        typeof metar?.visib === "number" ? metar.visib : parseFloat(String(metar?.visib)) || null;
      const category = decodeFlightCategory(visibilitySm, null);
      const wind =
        metar?.wdir !== undefined && metar?.wspd !== undefined
          ? `${metar.wdir}/${metar.wspd}KT`
          : "—";
      return { icao, airport, category, wind };
    })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter max-w-content mx-auto">
      {rows.map(({ icao, airport, category, wind }) => (
        <Link
          key={icao}
          href={`/airport/${icao}`}
          className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2 hover:border-primary transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-headline-md text-on-surface font-bold">{icao}</span>
            <FlightCategoryBadge category={category} />
          </div>
          <span className="text-data-text text-body-sm">
            {airport?.city ?? ""}
            {airport?.city && airport?.country ? ", " : ""}
            {airport?.country ?? ""}
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-data-mono text-on-surface">{wind}</span>
            <CategoryIcon category={category} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
  if (category === "IFR" || category === "LIFR")
    return <CloudOff size={16} className="text-danger-critical" />;
  if (category === "MVFR") return <CloudFog size={16} className="text-tertiary" />;
  return <Eye size={16} className="text-secondary" />;
}
