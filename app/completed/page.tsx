import type { Metadata } from "next";
import { AnimeGrid, Pager, SectionHead } from "@/components/cards";
import { getCompleted } from "@/lib/api";

export const metadata: Metadata = { title: "Anime Tamat" };

export const revalidate = 600;

export default async function CompletedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const j = await getCompleted(page);
  const items = j.anime_list ?? [];

  return (
    <div>
      <SectionHead title="🏁 Anime Tamat" />
      <AnimeGrid items={items} />
      <Pager base="/completed?page=" page={page} hasMore={items.length > 0} />
    </div>
  );
}
