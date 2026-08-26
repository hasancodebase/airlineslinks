// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-subtle mt-8 pb-16 md:pb-0">
      <div className="max-w-content mx-auto px-4 md:px-margin-page py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-sm text-data-text">
            © {year} AirTech Tools. Free aviation data — no login, no paywalls.
          </p>
          <p className="text-body-sm text-data-text">
            Reading, briefings, and deep dives on airline ops:{" "}
            <a
              href="https://airlinestechops.com"
              className="text-primary hover:underline"
            >
              airlinestechops.com
            </a>
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-body-sm text-on-surface-variant">
          <Link href="/tools" className="hover:text-primary transition-colors">
            Tools
          </Link>
          <Link href="/weather" className="hover:text-primary transition-colors">
            Weather
          </Link>
          <Link href="/maps" className="hover:text-primary transition-colors">
            Maps
          </Link>
          <Link href="/tools/reference" className="hover:text-primary transition-colors">
            Reference Guide
          </Link>
        </nav>
      </div>
    </footer>
  );
}
