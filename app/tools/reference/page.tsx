// app/tools/reference/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviation Ops Reference Guide — Airspace, ETOPS, Polar Routes | AirTech Tools",
  description:
    "Quick reference for airspace classes A-G, the semicircular flight level rule, ETOPS/EDTO diversion requirements, and polar route operations. Free, for pilots and dispatchers.",
};

const NAV_ITEMS = [
  { id: "airspace-classes", label: "Airspace Classes" },
  { id: "semicircular-rule", label: "Semicircular Rule" },
  { id: "etops-edto", label: "ETOPS / EDTO" },
  { id: "polar-routes", label: "Polar Routes" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 flex flex-col gap-3 border-b border-border-subtle pb-8">
      <h2 className="text-headline-md text-primary">{title}</h2>
      <div className="flex flex-col gap-3 text-body-md text-on-surface-variant">{children}</div>
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto border border-border-subtle rounded-lg">
      <table className="w-full text-body-sm text-left">
        <thead className="bg-surface-container-high text-label-caps text-data-text">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border-subtle">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 whitespace-nowrap text-on-surface">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReferencePage() {
  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-1 border-b border-border-subtle pb-4">
        <h1 className="text-headline-lg text-on-surface">Ops Reference Guide</h1>
        <p className="text-body-sm text-data-text">
          General reference material for flight operations. Always verify against the current
          AIP, company OM-A, and applicable regulations for your specific operation — rules vary
          by state and can change.
        </p>
      </header>

      {/* Quick nav */}
      <nav className="flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-body-sm text-on-surface-variant bg-surface-container-high hover:bg-surface-bright hover:text-primary transition-colors rounded-full px-3 py-1.5"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <Section id="airspace-classes" title="Airspace Classes (ICAO Annex 11)">
        <p>
          ICAO defines seven airspace classes, A through G, distinguished by whether IFR and VFR
          flight is permitted, what ATC service is provided, and what separation is guaranteed.
          Not every state uses every class — the US, for example, does not use Class F.
        </p>
        <Table
          head={["Class", "IFR/VFR", "ATC Clearance", "Separation Provided", "Typical Use"]}
          rows={[
            ["A", "IFR only", "Required", "All aircraft separated", "High-altitude enroute (e.g. above FL180/FL195)"],
            ["B", "IFR & VFR", "Required (both)", "All aircraft separated", "Major terminal areas"],
            ["C", "IFR & VFR", "Required (both)", "IFR from IFR & VFR; VFR from IFR", "Busy terminal areas / some enroute"],
            ["D", "IFR & VFR", "Required (both)", "IFR from IFR only", "Smaller controlled airports"],
            ["E", "IFR & VFR", "IFR only", "IFR from IFR only", "Controlled enroute airspace"],
            ["F", "IFR & VFR", "Not required", "Advisory service only", "Uncommon; being phased out in many states"],
            ["G", "IFR & VFR", "Not required", "None — see and avoid", "Uncontrolled airspace"],
          ]}
        />
        <p className="text-body-sm">
          Rule of thumb: as you move from A toward G, the level of ATC involvement and separation
          guarantee decreases. Class A is the most restrictive; Class G is uncontrolled.
        </p>
      </Section>

      <Section id="semicircular-rule" title="The Semicircular Flight Level Rule">
        <p>
          Under ICAO Annex 2, cruising level is tied to the magnetic track (true track in
          designated areas near the poles or where magnetic variation is unreliable) to keep
          opposite-direction traffic vertically separated. Below RVSM airspace, levels are spaced
          at 1,000 ft intervals; within RVSM airspace (typically FL290–FL410) at 1,000 ft
          intervals as well, once 1,000 ft vertical separation minima were extended upward.
        </p>
        <Table
          head={["Magnetic Track", "Non-RVSM Odd/Even", "RVSM (FL290–FL410)"]}
          rows={[
            ["000°–179°", "Odd thousands: FL170, 190, 210…", "Odd hundreds: FL290, 330, 370, 410"],
            ["180°–359°", "Even thousands: FL180, 200, 220…", "Even hundreds: FL310, 350, 390"],
          ]}
        />
        <p className="text-body-sm">
          Some states (historically the former Soviet bloc) apply a table based on true track
          with quadrantal-style bands instead of the standard hemispheric split — always confirm
          against the relevant AIP before flight planning through unfamiliar airspace.
        </p>
      </Section>

      <Section id="etops-edto" title="ETOPS / EDTO">
        <p>
          ETOPS (Extended-range Twin-engine Operational Performance Standards) — now formally
          EDTO (Extended Diversion Time Operations) under ICAO Annex 6, covering twins, three-
          and four-engine aircraft alike — governs how far a route can take an aircraft from an
          adequate diversion airport.
        </p>
        <p>
          The core number is the diversion time flown at the approved one-engine-inoperative
          (OEI) cruise speed, in still air, to the nearest adequate airport. Common approval
          thresholds:
        </p>
        <Table
          head={["Rating", "Max Diversion Time", "Typical Use"]}
          rows={[
            ["ETOPS-120", "120 min", "Entry-level twin-engine long-haul approval"],
            ["ETOPS-138", "138 min", "Extension used on some North Atlantic/Pacific routes"],
            ["ETOPS-180", "180 min", "Most transoceanic twin-engine operations"],
            ["ETOPS-240", "240 min", "Select city pairs, higher-reliability type/operator combos"],
            ["ETOPS-330/370", "330–370 min", "Ultra-long-haul twins (e.g. Southern Pacific, polar) on approved types"],
          ]}
        />
        <p className="text-body-sm">
          EDTO planning also drives fuel requirements (critical fuel scenario), MEL restrictions,
          crew and cabin equipment (extended supplemental oxygen, extra fire suppression), and
          designation of enroute alternate airports that must remain above defined weather minima
          throughout the flight-planning window.
        </p>
      </Section>

      <Section id="polar-routes" title="Polar Route Operations">
        <p>
          Flights routing over the Arctic (typically above 78°N) or through remote polar airspace
          bring a distinct set of operational requirements beyond standard EDTO planning:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <span className="text-on-surface">Communications:</span> HF and satellite
            communications (SATCOM) are required where VHF/CPDLC coverage doesn&apos;t reach —
            many polar tracks have defined comms-out procedures.
          </li>
          <li>
            <span className="text-on-surface">Navigation:</span> dual independent long-range
            navigation systems (INS/GPS) are typically required; near the poles, true track
            references replace magnetic ones since magnetic variation becomes unreliable close to
            the magnetic pole.
          </li>
          <li>
            <span className="text-on-surface">Fuel & cold-weather altimetry:</span> operators
            must account for fuel freeze points at very low outside air temperatures, and apply
            cold-temperature altimeter corrections at reporting points along the route.
          </li>
          <li>
            <span className="text-on-surface">Diversion planning:</span> similar in principle to
            EDTO but often with sparser, more remote alternates — some polar operations carry
            &quot;polar suitable airport&quot; requirements with limited services, requiring extra
            survival equipment for passengers and crew.
          </li>
          <li>
            <span className="text-on-surface">Space weather:</span> solar radiation events can
            degrade HF communications and increase radiation dose at high latitudes and altitudes;
            operators typically monitor space weather advisories and have procedures to
            descend or reroute if a significant event is forecast or in progress.
          </li>
        </ul>
      </Section>
    </div>
  );
}
