import type { Metadata } from "next";
import Link from "next/link";
import { AnimeGrid, SectionHead } from "@/components/cards";
import { getSearch } from "@/lib/api";

export const metadata: Metadata = { title: "Pencarian" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim() ?? "";
  let items: Awaited<ReturnType<typeof getSearch>>["anime_list"] | null = null;
  if (q) {
    const j = await getSearch(q).catch(() => null);
    items = j?.anime_list ?? [];
  }

  return (
    <div>
      <SectionHead title={q ? `Hasil pencarian: "${q}"` : "🔍 Pencarian"} />
      {!q && (
        <p className="py-16 text-center text-zinc-500">
          Ketik kata kunci di kotak pencarian di atas.
        </p>
      )}
      {q && (items?.length ?? 0) === 0 && (
        <p className="py-16 text-center text-zinc-500">Tidak ada hasil untuk &quot;{q}&quot;.</p>
      )}
      {items && items.length > 0 && <AnimeGrid items={items} />}
    </div>
  );
}
