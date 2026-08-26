// app/page.tsx
import { Zap, LayoutGrid, Gift, Navigation } from "lucide-react";
import AirportSearch from "@/components/AirportSearch";
import LiveFlightBoard from "@/components/LiveFlightBoard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-4 md:px-margin-page pt-10 pb-8 flex flex-col items-center text-center">
        <h1 className="text-headline-lg md:text-[48px] md:leading-[56px] lg:text-[64px] lg:leading-[72px] font-bold text-on-surface tracking-tighter mb-6 max-w-4xl">
          The Operations Dashboard Pilots Actually Use
        </h1>
        <p className="text-data-text text-body-md max-w-2xl mb-8">
          Live METAR, TAF, NOTAMs, Airport Data, Fuel Prices &amp; Radar for 70,000+ airports.
          Built for pilots, dispatchers, and aviation geeks. 100% Free.
        </p>

        <div className="w-full max-w-xl">
          <AirportSearch />
        </div>

        <Link
          href="/tools"
          className="mt-6 px-6 py-3 rounded-xl bg-primary-container text-on-primary-container
                     font-semibold hover:bg-primary transition-colors"
        >
          Explore All Tools
        </Link>

        <Link
          href="/nat-tracks"
          className="mt-3 inline-flex items-center gap-2 text-data-text hover:text-primary transition-colors text-body-sm"
        >
          <Navigation size={16} />
          View today&apos;s North Atlantic Tracks (NAT-OTS)
        </Link>

        <p className="mt-8 text-label-caps text-data-text uppercase">
          Trusted by 5,000+ aviation professionals
        </p>
      </section>

      {/* Live Flight Board Preview */}
      <section className="bg-surface-container-lowest px-4 md:px-margin-page py-10">
        <h2 className="text-headline-md text-on-surface mb-8 border-b border-border-subtle pb-4">
          Live Flight Board Preview
        </h2>
        <LiveFlightBoard />
      </section>

      {/* Feature pillars */}
      <section className="px-4 md:px-margin-page py-12 grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-content mx-auto w-full">
        <FeaturePillar
          icon={<Zap size={28} />}
          title="Fast & Accurate"
          description="Direct data feeds from NOAA and FAA. Low latency infrastructure ensures you always have the most recent METARs and NOTAMs before you brief."
        />
        <FeaturePillar
          icon={<LayoutGrid size={28} />}
          title="Built for Ops"
          description="High-density information layout designed specifically for dispatchers and pilots. Maximize situational awareness without scrolling."
        />
        <FeaturePillar
          icon={<Gift size={28} />}
          title="Always Free"
          description="No paywalls, no hidden API keys, no subscriptions. Essential flight operations data should be accessible to everyone in the aviation community."
        />
      </section>
    </div>
  );
}

function FeaturePillar({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-12 h-12 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-headline-md text-on-surface">{title}</h3>
      <p className="text-body-sm text-data-text">{description}</p>
    </div>
  );
}
