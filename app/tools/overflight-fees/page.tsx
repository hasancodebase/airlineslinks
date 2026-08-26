// app/tools/overflight-fees/page.tsx
import type { Metadata } from "next";
import OverflightCalculator from "./OverflightCalculator";

export const metadata: Metadata = {
  title: "US Overflight Fee Calculator | AirTech Tools",
  description:
    "Estimate FAA enroute and oceanic overflight fees for non-US-registered aircraft transiting US-controlled airspace, based on verified FAA rates per 100nm.",
};

export default function OverflightFeesPage() {
  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter max-w-2xl">
      <header className="flex flex-col gap-1 border-b border-border-subtle pb-4">
        <h1 className="text-headline-lg text-on-surface">US Overflight Fee Calculator</h1>
        <p className="text-body-sm text-data-text">
          Estimate FAA overflight fees for enroute and oceanic segments of US-controlled airspace.
        </p>
      </header>

      <OverflightCalculator />
    </div>
  );
}
