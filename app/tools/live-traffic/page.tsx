// app/tools/live-traffic/page.tsx
import type { Metadata } from "next";
import { isOpenSkyConfigured } from "@/lib/opensky";
import LiveTrafficClient from "./LiveTrafficClient";

export const metadata: Metadata = {
  title: "Live Air Traffic Tracker | AirTech Tools",
  description:
    "Real-time aircraft positions by region, powered by the free OpenSky Network API.",
};

export default function LiveTrafficPage() {
  const configured = isOpenSkyConfigured();

  return (
    <div className="w-full px-4 md:px-margin-page pt-6 pb-10 flex flex-col gap-gutter">
      <header className="flex flex-col gap-1 border-b border-border-subtle pb-4">
        <h1 className="text-headline-lg text-on-surface">Live Traffic Tracker</h1>
        <p className="text-body-sm text-data-text">
          Real-time aircraft positions by region, powered by OpenSky Network.
        </p>
      </header>

      {configured ? (
        <LiveTrafficClient />
      ) : (
        <div className="bg-surface-card border border-border-subtle rounded-lg p-container-padding flex flex-col gap-3">
          <h2 className="text-headline-md text-on-surface">One-time setup needed</h2>
          <p className="text-body-sm text-on-surface-variant">
            This tool uses the free OpenSky Network API, which requires a client ID and secret
            (no cost, just a quick signup):
          </p>
          <ol className="list-decimal pl-5 flex flex-col gap-1 text-body-sm text-on-surface-variant">
            <li>
              Create a free account at{" "}
              <span className="text-primary">opensky-network.org</span>
            </li>
            <li>In your account settings, create a new API client to get a client ID/secret</li>
            <li>
              Add them to <code className="text-data-text">.env.local</code>:
              <pre className="bg-surface-container-high rounded-md p-3 mt-1 text-body-sm font-mono text-on-surface overflow-x-auto">
{`OPENSKY_CLIENT_ID=your_client_id
OPENSKY_CLIENT_SECRET=your_client_secret`}
              </pre>
            </li>
            <li>Restart the dev server — this page will switch to the live tracker automatically</li>
          </ol>
        </div>
      )}
    </div>
  );
}
