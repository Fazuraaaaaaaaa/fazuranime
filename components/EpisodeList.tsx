"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface EpisodeCardItem {
  slug: string;
  /** Nomor episode, mis. 13 atau "OVA". */
  number: string;
  /** Tanggal rilis (sudah diformat), boleh kosong. */
  date?: string;
}

/** Ekstrak nomor episode dari slug/judul, mis. "k-on-episode-12" -> "12". */
function extractNumber(slug: string, title?: string): string {
  const src = title ?? "";
  const m =
    src.match(/episode\s*(\d+)/i) ||
    src.match(/\bEP\s*(\d+)\b/i) ||
    slug.match(/-episode-(\d+)/i);
  if (m) return m[1];
  if (/ova/i.test(src)) return "OVA";
  if (/movie/i.test(src)) return "Movie";
  return "?";
}

function formatTanggal(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

type Urutan = "desc" | "asc";

export default function EpisodeList({
  episodes,
  poster,
}: {
  episodes: EpisodeCardItem[];
  poster?: string;
}) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [urutan, setUrutan] = useState<Urutan>("desc");
  const [copied, setCopied] = useState(false);

  const maxEp = useMemo(
    () =>
      episodes.reduce((acc, e) => {
        const n = parseInt(e.number, 10);
        return Number.isNaN(n) ? acc : Math.max(acc, n);
      }, 0),
    [episodes],
  );

  const shown = useMemo(() => {
    let list = [...episodes];
    // Urutan berdasar nomor episode (angka dulu, sisanya di belakang)
    list.sort((a, b) => {
      const na = parseInt(a.number, 10);
      const nb = parseInt(b.number, 10);
      const va = Number.isNaN(na) ? -1 : na;
      const vb = Number.isNaN(nb) ? -1 : nb;
      return urutan === "desc" ? vb - va : va - vb;
    });
    if (searched.trim()) {
      const q = searched.trim().toLowerCase();
      list = list.filter(
        (e) => e.number.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q),
      );
    }
    return list;
  }, [episodes, searched, urutan]);

  async function salin() {
    const lines = episodes
      .slice()
      .map((e) => `EP ${e.number}${e.date ? ` — ${e.date}` : ""}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-extrabold md:text-xl">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-pink-500/20 text-xs text-pink-400">
            ☰
          </span>
          Episode (Series)
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(query);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Cari eps (1-${maxEp})`}
                inputMode="numeric"
                className="w-36 rounded-lg border border-white/10 bg-white/5 py-1.5 pl-8 pr-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-pink-400/60 sm:w-44"
              />
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500">
                ⌕
              </span>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-pink-400"
            >
              Cari
            </button>
          </form>

          {/* Urutan */}
          <button
            onClick={() => setUrutan((u) => (u === "desc" ? "asc" : "desc"))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-pink-400/60 hover:text-pink-300"
            aria-label="Ganti urutan episode"
          >
            Urutan: {urutan === "desc" ? `${maxEp} → 1` : `1 → ${maxEp}`}
          </button>

          {/* Salin */}
          <button
            onClick={salin}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-pink-400/60 hover:text-pink-300"
          >
            {copied ? "✓ Tersalin" : "⧉ Salin"}
          </button>
        </div>
      </div>

      {/* Grid kartu */}
      {shown.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {shown.map((e) => (
            <Link
              key={e.slug}
              href={`/episode/${e.slug}`}
              scroll={false}
              className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2 transition hover:border-pink-400/60 hover:bg-white/[0.07]"
            >
              {poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  className="h-14 w-10 flex-shrink-0 rounded-md object-cover sm:h-16 sm:w-11"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-white group-hover:text-pink-300">
                  EP {e.number}
                </p>
                {e.date && (
                  <p className="truncate text-[11px] text-zinc-500">{e.date}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-zinc-500">
          Episode tidak ditemukan{searched ? ` untuk "${searched}"` : ""}.
        </p>
      )}
    </section>
  );
}
