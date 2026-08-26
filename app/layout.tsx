// app/layout.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AirTech Tools — Free Live METAR, TAF, NOTAMs & Airport Data",
  description:
    "Live METAR, TAF, NOTAMs, airport data, and runway info for 70,000+ airports worldwide. Built for pilots, dispatchers, and aviation professionals. 100% free, no login required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-surface min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <Navbar />
        <main className="flex-1 w-full pt-14 max-w-content mx-auto">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
