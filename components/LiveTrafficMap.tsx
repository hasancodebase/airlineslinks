// components/LiveTrafficMap.tsx
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type AircraftState = {
  icao24: string;
  callsign: string | null;
  originCountry: string;
  longitude: number | null;
  latitude: number | null;
  baroAltitudeM: number | null;
  onGround: boolean;
  velocityMs: number | null;
  trueTrackDeg: number | null;
  verticalRateMs: number | null;
};

function fmtAltitude(m: number | null): string {
  if (m === null) return "—";
  return `${Math.round(m * 3.28084).toLocaleString()} ft`;
}

function fmtSpeed(ms: number | null): string {
  if (ms === null) return "—";
  return `${Math.round(ms * 1.94384)} kt`;
}

// ─────────────────────────────────────────────────────────────────────────
// ICON CONFIG — edit these to change how aircraft markers look. No need to
// touch anything else in this file.
// ─────────────────────────────────────────────────────────────────────────
const ICON_CONFIG = {
  shape: "plane" as "plane" | "chevron", // pick one of the shapes defined below
  size: 24, // marker size in pixels
  fillColor: "#FBBF24", // aircraft body color
  strokeColor: "#0F172A", // outline color
  strokeWidth: 0.6,
};

// Pre-verified icon shapes (rendered and visually checked before shipping).
// Add more here by pasting a new SVG path with viewBox="0 0 24 24", nose
// pointing straight up — rotation is applied automatically per-aircraft.
const ICON_SHAPES: Record<typeof ICON_CONFIG.shape, string> = {
  plane:
    "M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L21,16Z",
  chevron: "M12 1L21 20L12 15.5L3 20Z",
};

// Airplane/chevron silhouette, nose pointing "up" (north/000°) at rotation 0
// — rotated per-aircraft to match true track so it visually points the way
// it's flying. Reads from ICON_CONFIG above.
function planeIcon(trackDeg: number | null) {
  const rotation = trackDeg ?? 0;
  const { size, fillColor, strokeColor, strokeWidth, shape } = ICON_CONFIG;
  return L.divIcon({
    className: "aircraft-marker",
    html: `<div style="transform: rotate(${rotation}deg); width: ${size}px; height: ${size}px; display:flex; align-items:center; justify-content:center; filter: drop-shadow(0 0 2px rgba(0,0,0,0.6));">
      <svg width="${Math.round(size * 0.85)}" height="${Math.round(size * 0.85)}" viewBox="0 0 24 24" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}">
        <path d="${ICON_SHAPES[shape]}"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Glides a marker from wherever it currently sits to `target` over `durationMs`,
// using requestAnimationFrame. Reads the marker's live position each time a new
// target arrives (rather than trusting a stale "last known" ref), so it stays
// correct even if a new fetch lands mid-glide.
function AnimatedMarker({
  target,
  durationMs,
  icon,
  children,
}: {
  target: [number, number];
  durationMs: number;
  icon: L.DivIcon;
  children: React.ReactNode;
}) {
  const markerRef = useRef<L.Marker>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const current = marker.getLatLng();
    const from: [number, number] = [current.lat, current.lng];
    const to = target;
    const start = performance.now();

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    function step(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      // ease-in-out for a more natural glide than linear
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const lat = from[0] + (to[0] - from[0]) * eased;
      const lng = from[1] + (to[1] - from[1]) * eased;
      marker?.setLatLng([lat, lng]);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target[0], target[1], durationMs]);

  return (
    <Marker ref={markerRef} position={target} icon={icon}>
      {children}
    </Marker>
  );
}

// Slightly shorter than the 15s poll interval so each glide settles briefly
// before the next update lands, rather than animations overlapping/fighting.
const ANIMATION_DURATION_MS = 13000;

export default function LiveTrafficMap({
  states,
  center,
}: {
  states: AircraftState[];
  center: [number, number];
}) {
  const withPosition = states.filter(
    (s) => s.latitude !== null && s.longitude !== null && s.callsign
  );

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border-subtle">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        style={{ width: "100%", height: "100%", background: "#0b1326" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {withPosition.map((s) => (
          <AnimatedMarker
            key={s.icao24}
            target={[s.latitude as number, s.longitude as number]}
            durationMs={ANIMATION_DURATION_MS}
            icon={planeIcon(s.trueTrackDeg)}
          >
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                <strong>{s.callsign}</strong>
                <br />
                {s.originCountry}
                <br />
                Alt: {fmtAltitude(s.baroAltitudeM)}
                <br />
                Speed: {fmtSpeed(s.velocityMs)}
                <br />
                Track: {s.trueTrackDeg !== null ? `${Math.round(s.trueTrackDeg)}°` : "—"}
              </div>
            </Popup>
          </AnimatedMarker>
        ))}
      </MapContainer>
    </div>
  );
}
