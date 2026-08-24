import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FazurAnime — Nonton Anime Sub Indo Gratis Tanpa Iklan",
    template: "%s | FazurAnime",
  },
  description:
    "Platform streaming anime subtitle Indonesia: rilisan terbaru, jadwal, genre, dan pencarian. Tanpa iklan, kualitas HD.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#0a0b12] font-sans text-zinc-100 antialiased">
        {/* ambient background glow */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(600px circle at 85% -5%, rgba(56,189,248,.10), transparent 60%), radial-gradient(700px circle at 0% 30%, rgba(168,85,247,.08), transparent 55%)",
          }}
        />
        <Header />
        <main className="mx-auto max-w-7xl px-5 pb-24 pt-6">{children}</main>
        <footer className="border-t border-white/10 py-8 text-center text-sm leading-relaxed text-zinc-500">
          <p>
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text font-bold text-transparent">
              FazurAnime
            </span>{" "}
            — Nonton anime subtitle Indonesia tanpa iklan.
          </p>
          <p>
            Dibuat dengan Next.js · Data dari API scraper Sankavollerei (Anoboy &amp;
            Oploverz) · Semua hak cipta anime milik pemiliknya masing-masing.
          </p>
        </footer>
      </body>
    </html>
  );
}
