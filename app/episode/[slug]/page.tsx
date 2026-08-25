import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getEpisodeAny, type EpisodeWatch } from "@/lib/episode";
import { getDetailAny } from "@/lib/detail";
import EpisodeWatchUI from "@/components/EpisodeWatch";
import EpisodeList, { type EpisodeCardItem } from "@/components/EpisodeList";

/** Ekstrak nomor episode dari slug/judul (server-side). */
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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ep = (await getEpisodeAny(slug).catch(() => null)) ?? { title: undefined };
  return { title: (ep as { title?: string }).title ?? "Episode" };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const ep: EpisodeWatch | null = await getEpisodeAny(slug).catch(() => null);
  if (!ep || ep.streams.length === 0) notFound();

  // Ambil anime induk utk poster & daftar episode lengkap
  const animeSlug =
    (ep as { prevSlug?: string }).prevSlug?.replace(/-episode-.*$/, "") ??
    slug.replace(/-episode-.*$/, "");
  const detail = await getDetailAny(animeSlug).catch(() => null);
  const poster = detail?.detail?.poster;
  const allEps: { slug: string; title: string; release_date?: string }[] = (
    detail?.detail?.episode_list ?? []
  ).map((e) => ({
    slug: e.slug,
    title: e.title,
    release_date: e.release_date,
  }));
  const cards: EpisodeCardItem[] = allEps.map((e) => ({
    slug: e.slug,
    number: extractNumber(e.slug, e.title),
    date: formatTanggal(e.release_date),
  }));
  const fallbackCards =
    cards.length === 0
      ? [{ slug, number: extractNumber(slug, ep.title), date: "" }]
      : cards;

  return (
    <div>
      <Link
        href={animeSlug !== slug ? `/anime/${animeSlug}` : "/"}
        className="mb-3 inline-block text-sm font-semibold text-zinc-400 hover:text-white"
      >
        ← {detail?.detail?.title ?? "Beranda"}
      </Link>
      <h1 className="mb-4 text-lg font-extrabold md:text-2xl">{ep.title}</h1>

      <EpisodeWatchUI
        watch={{
          title: ep.title,
          streams: ep.streams,
          qualities: ep.qualities,
          hasPrev: ep.hasPrev ?? Boolean(ep.prevSlug),
          prevSlug: ep.prevSlug,
          hasNext: ep.hasNext ?? Boolean(ep.nextSlug),
          nextSlug: ep.nextSlug,
        }}
      />

      {/* Daftar episode lengkap */}
      <div data-episode-list>
        <EpisodeList episodes={fallbackCards} poster={poster} />
      </div>
    </div>
  );
}
