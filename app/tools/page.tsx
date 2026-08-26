// app/tools/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calculator, Radar, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Aviation Tools — Reference Guides & Calculators | AirTech Tools",
  description:
    "Free aviation operations tools: airspace and ETOPS reference guides, US overflight fee calculator, and more. Built for pilots, dispatchers, and aviation professionals.",
};

type ToolEntry = {
  href: string;
  title: string;
  description: string;
  icon: typeof Wrench;
  status: "live" | "soon";
};

const TOOLS: ToolEntry[] = [
  {
    href: "/tools/reference",
    title: "Ops Reference Guide",
    description:
      "Airspace classes, the semicircular flight level rule, ETOPS/EDTO, and polar route requirements — quick reference for dispatchers and pilots.",
    icon: BookOpen,
    status: "live",
  },
  {
    href: "/tools/overflight-fees",
    title: "US Overflight Fee Calculator",
    description:
      "Estimate FAA enroute and oceanic overflight fees for US airspace based on great-circle distance.",
    icon: Calculator,
    status: "live",
  },
  {
    href: "/tools/live-traffic",
    title: "Live Traffic Tracker",
    description:
      "Real-time aircraft positions over any region, powered by OpenSky Network.",
    icon: Radar,
    status: "soon",
  },
];

export default function ToolsPage() {
  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-1 border-b border-border-subtle pb-4">
        <h1 className="text-headline-lg text-on-surface">Tools</h1>
        <p className="text-body-sm text-data-text">
          Free reference guides and calculators for flight operations. No login, no paywalls.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const card = (
            <div
              className={`h-full bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2 transition-colors ${
                tool.status === "live" ? "hover:border-primary/50" : "opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="text-primary" size={22} />
                {tool.status === "soon" && (
                  <span className="text-label-caps text-data-text bg-surface-container-high px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              <h2 className="text-headline-md text-on-surface">{tool.title}</h2>
              <p className="text-body-sm text-data-text">{tool.description}</p>
            </div>
          );

          return tool.status === "live" ? (
            <Link key={tool.href} href={tool.href}>
              {card}
            </Link>
          ) : (
            <div key={tool.href}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
