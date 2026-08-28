// app/api/radar/route.ts
// Proxies RainViewer's free public radar frame list (no API key required).
// Docs: https://www.rainviewer.com/api.html — free tier: ~2 hours of past
// radar frames plus a short nowcast, refreshed every 5-10 minutes.
import { NextResponse } from "next/server";

const RAINVIEWER_URL = "https://api.rainviewer.com/public/weather-maps.json";

export const revalidate = 300; // new frames appear roughly every 5-10 min

export async function GET() {
  try {
    const res = await fetch(RAINVIEWER_URL, { next: { revalidate: 300 } });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `RainViewer returned ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();

    const host: string = data.host;
    const past = (data.radar?.past ?? []).map((f: { time: number; path: string }) => ({
      time: f.time,
      path: f.path,
    }));
    const nowcast = (data.radar?.nowcast ?? []).map((f: { time: number; path: string }) => ({
      time: f.time,
      path: f.path,
    }));

    return NextResponse.json({
      success: true,
      host,
      frames: [...past, ...nowcast],
      pastCount: past.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach RainViewer." },
      { status: 502 }
    );
  }
}
