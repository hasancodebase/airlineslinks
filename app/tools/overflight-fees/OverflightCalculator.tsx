// app/tools/overflight-fees/OverflightCalculator.tsx
"use client";

import { useMemo, useState } from "react";

// Rates verified directly against 14 CFR / ecfr.gov FAA overflight fee schedule.
// Unchanged since January 2019 at time of writing — always confirm current rate
// against the FAA's published fee schedule before using for billing purposes.
const ENROUTE_RATE_PER_100NM = 61.75;
const OCEANIC_RATE_PER_100NM = 26.51;

function formatUsd(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function OverflightCalculator() {
  const [enrouteNm, setEnrouteNm] = useState<string>("");
  const [oceanicNm, setOceanicNm] = useState<string>("");

  const { enrouteFee, oceanicFee, totalFee } = useMemo(() => {
    const enroute = parseFloat(enrouteNm) || 0;
    const oceanic = parseFloat(oceanicNm) || 0;
    const eFee = (enroute / 100) * ENROUTE_RATE_PER_100NM;
    const oFee = (oceanic / 100) * OCEANIC_RATE_PER_100NM;
    return { enrouteFee: eFee, oceanicFee: oFee, totalFee: eFee + oFee };
  }, [enrouteNm, oceanicNm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-caps text-data-text">Enroute distance (nm)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={enrouteNm}
            onChange={(e) => setEnrouteNm(e.target.value)}
            placeholder="e.g. 850"
            className="bg-surface-container-high border border-border-subtle rounded-md px-3 py-2
                       text-on-surface text-body-md focus:outline-none focus:border-primary transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-label-caps text-data-text">Oceanic distance (nm)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={oceanicNm}
            onChange={(e) => setOceanicNm(e.target.value)}
            placeholder="e.g. 0"
            className="bg-surface-container-high border border-border-subtle rounded-md px-3 py-2
                       text-on-surface text-body-md focus:outline-none focus:border-primary transition-colors"
          />
        </label>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-2">
        <div className="flex items-center justify-between text-body-sm">
          <span className="text-data-text">Enroute fee ({formatUsd(ENROUTE_RATE_PER_100NM)}/100nm)</span>
          <span className="text-on-surface font-mono">{formatUsd(enrouteFee)}</span>
        </div>
        <div className="flex items-center justify-between text-body-sm">
          <span className="text-data-text">Oceanic fee ({formatUsd(OCEANIC_RATE_PER_100NM)}/100nm)</span>
          <span className="text-on-surface font-mono">{formatUsd(oceanicFee)}</span>
        </div>
        <div className="flex items-center justify-between text-headline-md border-t border-border-subtle pt-2 mt-1">
          <span className="text-on-surface">Estimated total</span>
          <span className="text-primary font-mono">{formatUsd(totalFee)}</span>
        </div>
      </div>

      <p className="text-body-sm text-data-text">
        Formula: fee = (distance ÷ 100) × rate, applied separately to enroute and oceanic segments
        and summed. This estimates the FAA overflight fee charged to non-US-registered aircraft
        overflying US-controlled airspace without landing. It is an estimate only — always confirm
        against the FAA&apos;s current published fee schedule before billing or budgeting.
      </p>
    </div>
  );
}
