// app/api/nat-tracks/route.ts
// GET /api/nat-tracks — today's North Atlantic organized tracks, parsed from the
// free unauthenticated FAA NMS feed. No query params needed.
import { NextResponse } from "next/server";
import { fetchNatTracks } from "@/lib/natTracks";

export const revalidate = 1800; // 30 min — tracks publish ~1400Z and ~2200Z

export async function GET() {
  try {
    const messages = await fetchNatTracks();
    return NextResponse.json({
      success: true,
      data: messages,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch NAT tracks",
      },
      { status: 502 }
    );
  }
}
