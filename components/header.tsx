"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/ongoing", label: "Ongoing" },
  { href: "/completed", label: "Tamat" },
  { href: "/katalog", label: "Katalog" },
  { href: "/jadwal", label: "Jadwal" },
  { href: "/genre", label: "Genre" },
  { href: "/az", label: "A-Z" },
  { href: "/tentang", label: "Tentang" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-[#0a0b12]/95 backdrop-blur"
          : "border-transparent bg-[#0a0b12]/70 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3">
        <Logo />
        <nav className="flex flex-wrap gap-1">
          {NAV.map((n) => {
            const active =
              n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-sky-500/20 to-violet-500/20 text-white ring-1 ring-inset ring-sky-400/40"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <form
          className="group relative ml-auto w-full min-w-[200px] max-w-md sm:w-auto sm:flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-50 transition group-focus-within:opacity-100 group-focus-within:text-sky-400"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari anime..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm outline-none transition placeholder:text-zinc-500 focus:border-sky-500/60 focus:bg-white/10 focus:ring-4 focus:ring-sky-500/10"
          />
        </form>
      </div>
    </header>
  );
}
