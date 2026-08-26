// components/AirportSearch.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Airport } from "@/lib/airports";

export default function AirportSearch({
  placeholder = "Search Airport ICAO - e.g. OPKC",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/airports/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
          setOpen(true);
        }
      } catch {
        // aborted or network error — ignore, next keystroke will retry
      }
    }, 200); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToAirport = (icao: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/airport/${icao}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (/^[A-Z0-9]{4}$/.test(trimmed)) {
      goToAirport(trimmed);
    } else if (results[0]) {
      goToAirport(results[0].icao);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-data-text pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-surface-card border border-border-subtle rounded-xl py-4 pl-12 pr-4
                     font-mono text-data-mono text-on-surface placeholder:text-data-text
                     focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
      </form>

      {open && results.length > 0 && (
        <ul className="absolute mt-2 w-full bg-surface-container-high border border-border-subtle rounded-lg shadow-lg overflow-hidden z-10">
          {results.map((airport) => (
            <li key={airport.icao}>
              <button
                onClick={() => goToAirport(airport.icao)}
                className="w-full text-left px-4 py-3 hover:bg-surface-bright transition-colors flex items-center justify-between gap-3"
              >
                <span className="flex flex-col">
                  <span className="text-on-surface text-body-md font-semibold">
                    {airport.icao}
                    {airport.iata ? ` / ${airport.iata}` : ""}
                  </span>
                  <span className="text-data-text text-body-sm">
                    {airport.name} — {airport.city ?? airport.country}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
