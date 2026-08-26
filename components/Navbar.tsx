// components/Navbar.tsx
// Public, no-login navbar — used at every screen width. No profile, no sidebar,
// no personal data of any kind. Matches the "100% Free, No Login Required" promise.
import Link from "next/link";
import { Plane, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-surface-container border-b border-border-subtle
                 flex items-center justify-between px-4 md:px-margin-page h-14"
    >
      <Link href="/" className="flex items-center gap-3">
        <Plane className="text-primary" size={22} strokeWidth={2.25} />
        <span className="font-sans text-headline-lg font-bold tracking-tighter text-primary uppercase">
          AirTech Tools
        </span>
      </Link>

      <Link
        href="/tools"
        aria-label="Search tools"
        className="text-on-surface-variant hover:bg-surface-bright hover:text-primary
                   transition-colors rounded-full p-2"
      >
        <Search size={20} />
      </Link>
    </header>
  );
}
