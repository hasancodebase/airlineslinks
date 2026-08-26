// app/api/airports/search/route.ts
// GET /api/airports/search?q=karachi
//
// NOTE: intentionally NOT edge runtime. searchAirports() uses Node's fs module
// to read public/airports.json, and Edge Functions can't use fs.
import { NextRequest, NextResponse } from "next/server";
import { searchAirports } from "@/lib/airports";

export const revalidate = 3600; // airport list barely changes; safe to cache long

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (q.trim().length < 2) {
    return NextResponse.json({
      success: true,
      data: [],
      cached: false,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const results = searchAirports(q, 10);
    return NextResponse.json({
      success: true,
      data: results,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
