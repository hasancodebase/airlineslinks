// components/RadarMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Play, Pause, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { DARK_TILE_URL, DARK_TILE_ATTRIBUTION } from "@/lib/mapTiles";

type Frame = { time: number; path: string };

const TILE_SIZE = 256;
const COLOR_SCHEME = 2; // RainViewer "Universal Blue" scheme
const SMOOTH_SNOW = "1_1";

// Each frame is ~10 min apart in real time. Hold each frame this long while
// animating; hold the final ("now") frame noticeably longer so it reads as
// the current moment rather than flashing past.
const FRAME_MS = 500;
const LAST_FRAME_MS = 1800;

function formatFrameTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RadarMap({
  center = [24.8547, 67.0207], // Karachi, as a sensible default view
  zoom = 5,
}: {
  center?: [number, number];
  zoom?: number;
}) {
  const [host, setHost] = useState<string | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [pastCount, setPastCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/radar");
        const data = await res.json();
        if (!res.ok || !data.success) {
          if (!cancelled) setError(data.error || "Failed to load radar frames.");
          return;
        }
        if (!cancelled) {
          setHost(data.host);
          setFrames(data.frames);
          setPastCount(data.pastCount);
          setIndex(Math.max(0, data.pastCount - 1)); // start on the most recent "now" frame
        }
      } catch {
        if (!cancelled) setError("Failed to reach the radar endpoint.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    // Refresh the frame list periodically so new frames keep appearing.
    const refreshInterval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const isLastFrame = index === frames.length - 1;
    timeoutRef.current = setTimeout(
      () => setIndex((i) => (i + 1) % frames.length),
      isLastFrame ? LAST_FRAME_MS : FRAME_MS
    );
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [playing, index, frames.length]);

  const currentFrame = frames[index];
  const isForecast = index >= pastCount;

  if (loading) {
    return (
      <div className="w-full h-[500px] rounded-lg border border-border-subtle bg-surface-card flex items-center justify-center text-body-sm text-data-text gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading radar…
      </div>
    );
  }

  if (error || !host || frames.length === 0) {
    return (
      <div className="w-full h-[500px] rounded-lg border border-border-subtle bg-surface-card flex items-center justify-center text-body-sm text-data-text text-center px-6">
        {error || "Radar data unavailable right now."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border-subtle relative">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom
          style={{ width: "100%", height: "100%", background: "#0b1326" }}
        >
          <TileLayer attribution={DARK_TILE_ATTRIBUTION} url={DARK_TILE_URL} />
          {currentFrame && (
            <TileLayer
              key={currentFrame.path}
              url={`${host}${currentFrame.path}/${TILE_SIZE}/{z}/{x}/{y}/${COLOR_SCHEME}/${SMOOTH_SNOW}.png`}
              opacity={0.7}
              maxNativeZoom={7}
            />
          )}
        </MapContainer>

        <div className="absolute bottom-3 left-3 right-3 bg-surface-base/90 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="text-primary hover:brightness-110 transition shrink-0"
          >
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <input
            type="range"
            min={0}
            max={frames.length - 1}
            value={index}
            onChange={(e) => {
              setPlaying(false);
              setIndex(Number(e.target.value));
            }}
            className="flex-1 accent-primary"
          />

          <span className="text-body-sm font-mono text-on-surface whitespace-nowrap shrink-0">
            {currentFrame ? formatFrameTime(currentFrame.time) : "—"}
            {isForecast && <span className="text-primary ml-1">(fcst)</span>}
          </span>
        </div>
      </div>

      <p className="text-body-sm text-data-text">
        Rain/snow radar — last ~2 hours plus short forecast, via{" "}
        <a
          href="https://www.rainviewer.com"
          className="text-primary hover:underline"
        >
          RainViewer
        </a>
        . Refreshes every 5-10 minutes.
      </p>
    </div>
  );
}
