import type { Metadata } from "next";
import { AnimeGrid, Pager, SectionHead } from "@/components/cards";
import { getGenreList } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Genre: ${slug}` };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(sp.page) || 1);
  const j = await getGenreList(slug, page).catch(() => null);
  const items = j?.anime_list ?? [];

  return (
    <div>
      <SectionHead title={`🎭 Genre: ${decodeURIComponent(slug)}`} />
      {items.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">Tidak ada anime pada genre ini.</p>
      ) : (
        <AnimeGrid items={items} />
      )}
      <Pager base={`/genre/${slug}?page=`} page={page} hasMore={items.length > 0} />
    </div>
  );
}
