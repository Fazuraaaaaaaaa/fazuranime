import type { Metadata } from "next";
import { AnimeGrid, Pager, SectionHead } from "@/components/cards";
import { getOngoing } from "@/lib/api";

export const metadata: Metadata = { title: "Anime Ongoing" };

export const revalidate = 300;

export default async function OngoingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const j = await getOngoing(page);
  const items = j.anime_list ?? [];

  return (
    <div>
      <SectionHead title="🔥 Anime Ongoing" />
      <AnimeGrid items={items} />
      <Pager base="/ongoing?page=" page={page} hasMore={items.length > 0} />
    </div>
  );
}
