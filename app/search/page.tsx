import type { Metadata } from "next";
import { AnimeGrid, SectionHead } from "@/components/cards";
import { catalogSorted } from "@/lib/catalog";

export const metadata: Metadata = { title: "Pencarian" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

/** Pencarian instan di katalog lokal — tanpa request ke API, tanpa rate-limit. */
function searchLocal(q: string) {
  const needle = q.toLowerCase();
  return catalogSorted.filter(
    (a) =>
      a.title?.toLowerCase().includes(needle) ||
      a.slug?.toLowerCase().includes(needle),
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (await searchParams).q?.trim() ?? "";
  const results = q ? searchLocal(q) : [];

  return (
    <div>
      <SectionHead
        title={q ? `Hasil pencarian: "${q}" (${results.length} judul)` : "🔍 Pencarian"}
      />
      {!q && (
        <p className="py-16 text-center text-zinc-500">
          Ketik kata kunci di kotak pencarian di atas.
        </p>
      )}
      {q && results.length === 0 && (
        <>
          <p className="py-8 text-center text-zinc-500">
            Tidak ada hasil untuk &quot;{q}&quot; di katalog ({catalogSorted.length}{" "}
            judul).
          </p>
          <LocalFallbackQuery q={q} />
        </>
      )}
      {results.length > 0 && <AnimeGrid items={results} />}
    </div>
  );
}

/** Fallback: kalau tidak ketemu di katalog lokal, coba API live. */
async function LocalFallbackQuery({ q }: { q: string }) {
  const { getSearch } = await import("@/lib/api");
  const j = await getSearch(q).catch(() => null);
  const items = j?.anime_list ?? [];
  if (items.length === 0) return null;
  return (
    <>
      <h3 className="mb-3 mt-4 text-sm font-semibold text-zinc-400">
        Hasil dari sumber langsung:
      </h3>
      <AnimeGrid items={items} />
    </>
  );
}
