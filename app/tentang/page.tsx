import type { Metadata } from "next";
import { FazurMark } from "@/components/logo";
import { SectionHead } from "@/components/cards";

export const metadata: Metadata = { title: "Tentang" };

const FEATURES = [
  ["🚫", "Tanpa Iklan", "Nonton nyaman tanpa pop-up atau redirect yang mengganggu."],
  ["⚡", "Server-Side Rendered", "Dibangun dengan Next.js — cepat, SEO-friendly, dan data di-cache di server."],
  ["📱", "Responsif", "Tampil rapi dari HP, tablet, maupun desktop."],
  ["🔎", "Pencarian Lengkap", "Cari berdasarkan judul, genre, jadwal, atau telusuri daftar A-Z."],
] as const;

const FAQS = [
  ["Apakah gratis?", "Ya, 100% gratis tanpa registrasi."],
  [
    "Dari mana sumber videonya?",
    'Stream diambil melalui API scraper dari Anoboy (server blogger video). Jika embed diblokir, gunakan tombol "Buka di tab baru".',
  ],
  [
    "Apakah ini legal?",
    "Ini hanya proyek demonstrasi teknis. Semua konten anime adalah milik pemilik hak ciptanya masing-masing. Dukung industri anime dengan menonton lewat platform resmi.",
  ],
] as const;

export default function AboutPage() {
  return (
    <div>
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1a2e] via-[#12142a] to-[#160f2b] px-8 py-12">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="animate-float pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 opacity-20 md:block">
          <FazurMark size={120} />
        </div>
        <h1 className="relative font-display text-4xl font-extrabold">
          Tentang{" "}
          <span className="logo-shimmer bg-gradient-to-r from-sky-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
            FazurAnime
          </span>
        </h1>
        <p className="relative mt-4 max-w-2xl leading-relaxed text-zinc-400">
          Platform streaming anime subtitle Indonesia — dibangun dengan Next.js
          App Router, mengambil data langsung dari API scraper Sankavollerei
          (Anoboy &amp; Oploverz) dengan caching di sisi server.
        </p>
      </section>

      <SectionHead title="Kenapa Pilih Kami?" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(([icon, title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-sky-400/40"
          >
            <div className="mb-3 text-2xl">{icon}</div>
            <h3 className="font-display font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>

      <SectionHead title="FAQ" />
      <div>
        {FAQS.map(([q, a]) => (
          <details
            key={q}
            className="group mb-2.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold marker:content-none">
              {q}
              <span className="text-lg text-sky-400 transition group-open:hidden">+</span>
              <span className="hidden text-lg text-sky-400 group-open:inline">−</span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
