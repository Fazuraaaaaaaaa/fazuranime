import type { Metadata } from "next";
import Link from "next/link";
import { SectionHead } from "@/components/cards";
import { getGenres } from "@/lib/api";

export const metadata: Metadata = { title: "Genre" };

export const revalidate = 3600;

export default async function GenreIndexPage() {
  const j = await getGenres().catch(() => null);
  const genres = j?.genres ?? [];

  return (
    <div>
      <SectionHead title="🎭 Daftar Genre" />
      <div className="flex flex-wrap gap-2.5">
        {genres.map((g) => (
          <Link
            key={g.slug}
            href={`/genre/${g.slug}`}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:border-violet-500 hover:text-violet-300"
          >
            {g.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
