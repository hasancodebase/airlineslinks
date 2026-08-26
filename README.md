# airlineslinks — Complete Ready-to-Run Project

This is the **whole project**, already scaffolded and built — not a starter to merge into
something else. No `create-next-app` step needed. Unzip, install, run.

## Setup (3 steps)

1. **Unzip this folder as `D:\airlineslinks`** (or wherever you want the project to live).
   Open it in VS Code: `code D:\airlineslinks`

2. **Install dependencies** (in a VS Code terminal, inside the project folder):
   ```
   npm install
   ```

3. **Run it:**
   ```
   npm run dev
   ```
   Then open `http://localhost:3000` in your browser.

That's it — no copying folders, no overwriting files, no merge conflicts.

## What to check once it's running

- `http://localhost:3000/` — homepage: hero, airport search, live flight board
- `http://localhost:3000/airport/OPKC` — full airport detail page (METAR/TAF/NOTAMs/Runways tabs)
- `http://localhost:3000/nat-tracks` — today's live North Atlantic organized tracks
- `http://localhost:3000/api/metar?icao=OPKC` — raw METAR API response
- `http://localhost:3000/api/nat-tracks` — raw NAT tracks API response
- `http://localhost:3000/api/airports/search?q=karachi` — airport search API

**Paste back exactly what you see for each** — a working page, an error, or a blank
screen — so we can fix anything that comes up. Your machine has normal internet access
(my sandbox is network-restricted, which is why some of these couldn't be tested on my end).

## Environment variables (optional — site works without them)

```
copy .env.local.example .env.local
```

Every value in it is optional right now:
- `UPSTASH_REDIS_REST_URL` / `TOKEN` — not needed, Next.js's built-in caching covers MVP
- `FAA_API_KEY` — only for future official FAA NOTAM access (not used yet)
- `EIA_API_KEY` — only for a future jet fuel price feature (not built yet)

## What's inside

```
airlineslinks/
├── public/airports.json       ← 6,000 airports w/ runways + frequencies (OurAirports data)
├── scripts/                   ← Python script to refresh airports.json later, if needed
├── lib/
│   ├── airports.ts             ← airport search/lookup
│   ├── aviation.ts             ← NOAA METAR/TAF, NOTAM fallback, flight category logic
│   ├── natTracks.ts            ← FAA NAT track feed fetch + parser
│   └── utils.ts
├── tailwind.config.ts          ← exact design tokens from your Stitch export
├── app/
│   ├── globals.css / layout.tsx / page.tsx
│   ├── api/                    ← metar, taf, notam, nat-tracks, airports/search routes
│   ├── airport/[icao]/         ← airport detail page
│   └── nat-tracks/             ← NAT-OTS page
└── components/                 ← Navbar, BottomNav, AirportSearch, MetarCard, TafCard,
                                    NotamCard, RunwayCard, FlightCategoryBadge, NatTrackCard,
                                    LiveFlightBoard
```

## Design decisions already made (see full chat for reasoning)

- No login, no sidebar, no profile UI — matches "100% free, no login required"
- lucide-react icons (not Material Symbols) — matches your original tech spec
- NAT Tracks parser built and tested against real FAA feed data before being shipped

## Known open items — still to build

- `/tools`, `/weather`, `/maps` pages (linked from nav, not built yet — will 404 for now)
- Domain still hardcoded as placeholder in a couple of places (`lib/aviation.ts` User-Agent) —
  update once subdomain vs. standalone decision is locked
- Reference content (airspace classes, ETOPS, polar ops), overflight fee calculator, OpenSky
  live tracker, MRO directory — all researched and scoped, not yet built
