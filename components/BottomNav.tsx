// components/BottomNav.tsx
// Mobile-only persistent tab bar, matches the Stitch mockups. Desktop relies on
// the Navbar + in-page links instead — no separate desktop-only nav element.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Cloud, Map, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Airports", icon: MapPin },
  { href: "/weather", label: "Weather", icon: Cloud },
  { href: "/maps", label: "Maps", icon: Map },
  { href: "/tools", label: "Tools", icon: Wrench },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center
                 py-2 px-4 bg-surface-container-low border-t border-border-subtle z-50"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center active:scale-95 transition-transform",
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary transition-colors"
            )}
          >
            <Icon size={22} />
            <span className="text-label-caps mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
