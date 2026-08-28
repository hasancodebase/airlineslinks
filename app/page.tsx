// app/page.tsx
import { Zap, LayoutGrid, Gift, Navigation, CloudSun, Radar, Map as MapIcon, Calculator, BookOpen } from "lucide-react";
import AirportSearch from "@/components/AirportSearch";
import Link from "next/link";

type Feature = {
  href: string;
  title: string;
  description: string;
  icon: typeof CloudSun;
  accent: "primary" | "secondary" | "tertiary";
};

const FEATURES: Feature[] = [
  {
    href: "/weather",
    title: "Weather",
    description: "Live METAR, TAF, and a rain radar loop for any airport, updated in real time.",
    icon: CloudSun,
    accent: "primary",
  },
  {
    href: "/tools/live-traffic",
    title: "Live Traffic Tracker",
    description: "Real aircraft positions on an animated map, powered by OpenSky Network.",
    icon: Radar,
    accent: "secondary",
  },
  {
    href: "/nat-tracks",
    title: "North Atlantic Tracks",
    description: "Today's eastbound and westbound NAT-OTS routes, straight from the FAA feed.",
    icon: Navigation,
    accent: "tertiary",
  },
  {
    href: "/maps",
    title: "Maps & Routes",
    description: "Airport search, oceanic tracks, and live traffic brought together in one view.",
    icon: MapIcon,
    accent: "primary",
  },
  {
    href: "/tools/overflight-fees",
    title: "Overflight Fee Calculator",
    description: "Estimate US FAA enroute and oceanic overflight fees in seconds.",
    icon: Calculator,
    accent: "secondary",
  },
  {
    href: "/tools/reference",
    title: "Ops Reference Guide",
    description: "Airspace classes, the semicircular rule, ETOPS/EDTO, and polar routes.",
    icon: BookOpen,
    accent: "tertiary",
  },
];

const ACCENT_STYLES: Record<Feature["accent"], string> = {
  primary: "bg-primary-container/20 text-primary-container group-hover:bg-primary-container/30",
  secondary: "bg-secondary-container/20 text-secondary group-hover:bg-secondary-container/30",
  tertiary: "bg-tertiary-container/20 text-tertiary group-hover:bg-tertiary-container/30",
};

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

        <p className="mt-8 text-label-caps text-data-text uppercase">
          Trusted by 5,000+ aviation professionals
        </p>
      </section>

      {/* Feature showcase */}
      <section className="bg-surface-container-lowest px-4 md:px-margin-page py-14">
        <div className="max-w-content mx-auto w-full mb-10 text-center">
          <h2 className="text-headline-lg text-on-surface mb-2">
            Everything You Need for Flight Ops
          </h2>
          <p className="text-body-md text-data-text max-w-xl mx-auto">
            Six tools, all live, all free — no login required.
          </p>
        </div>

        <div className="max-w-content mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group bg-surface-card border border-border-subtle rounded-xl p-container-padding
                           flex flex-col gap-4 hover:border-primary hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${ACCENT_STYLES[f.accent]}`}
                >
                  <Icon size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-headline-md text-on-surface">{f.title}</h3>
                  <p className="text-body-sm text-data-text">{f.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
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
