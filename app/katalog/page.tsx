import type { Metadata } from "next";
import { AnimeGrid, Pager, SectionHead } from "@/components/cards";
import { catalogAll, catalogSorted, paginate, totalPages } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Katalog Lengkap — Ratusan Judul Anime",
  description:
    "Seluruh katalog anime FazurAnime, terurut dari rilisan terbaru. Cari lewat huruf A-Z atau filter tahun.",
};

interface Props {
  searchParams: Promise<{ page?: string; letter?: string }>;
}

const LETTERS = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function applyLetter(letter?: string) {
  if (letter && /^[A-Z#]$/i.test(letter)) {
    const L = letter.toUpperCase();
    const re = new RegExp(`^[${L === "#" ? "0-9" : L}]`, "i");
    return catalogSorted.filter((a) => re.test(a.title));
  }
  return catalogSorted;
}

export default async function KatalogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const items = applyLetter(sp.letter);
  const shown = paginate(items, page);

  return (
    <div>
      <SectionHead
        title={`📚 Katalog Lengkap (${catalogAll.length} judul)`}
        href="/az"
      />
      <p className="mb-4 -mt-1 text-sm text-zinc-500">
        Semua anime di FazurAnime dalam satu halaman, diurutkan dari rilisan
        terbaru. Gunakan huruf untuk memfilter.
      </p>

      <div className="mb-6 flex flex-wrap gap-1.5">
        <a
          href="/katalog"
          className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
            !sp.letter
              ? "bg-gradient-to-r from-sky-600 to-violet-600"
              : "border border-white/10 bg-white/5 hover:border-sky-400"
          }`}
        >
          Semua
        </a>
        {LETTERS.map((l) => (
          <a
            key={l}
            href={`/katalog?letter=${l}`}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
              sp.letter?.toUpperCase() === l
                ? "bg-gradient-to-r from-sky-600 to-violet-600"
                : "border border-white/10 bg-white/5 hover:border-sky-400"
            }`}
          >
            {l}
          </a>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">Tidak ada judul.</p>
      ) : (
        <AnimeGrid items={shown} />
      )}
      <Pager base={`/katalog${sp.letter ? `?letter=${sp.letter}&` : "?"}page=`} page={page} hasMore={page < totalPages(items)} />
    </div>
  );
}
