import { getEpisode, getEpisodeSamehadaku } from "@/lib/api";

export interface EpisodeWatch {
  title: string;
  /** Server streaming yang bisa langsung di-embed (url final). */
  streams: { name: string; url: string }[];
  /** Kualitas tersedia (mis. "360p"|"480p"|"720p") -> url embed. */
  qualities: Record<string, string>;
  downloads: { name: string; resolution: string; url: string }[];
  releasedOn?: string;
  hasPrev?: boolean;
  prevSlug?: string | null;
  hasNext?: boolean;
  nextSlug?: string | null;
}

/** Ambil data episode dengan fallback tiga sumber (Anoboy -> Oploverz -> Samehadaku). */
export async function getEpisodeAny(slug: string): Promise<EpisodeWatch | null> {
  const a = await getEpisode(slug).catch(() => null);
  if (a && (a.streams?.length ?? 0) > 0) {
    return {
      title: a.title,
      streams: a.streams ?? [],
      qualities: {},
      downloads: a.downloads ?? [],
    };
  }
  const { api } = await import("@/lib/api");
  const o = await api<{
    title?: string;
    episode_title?: string;
    streams?: { name: string; url: string }[];
    downloads?: { name: string; resolution: string; url: string }[];
  }>(`/oploverz/episode/${slug}`).catch(() => null);
  if (o && (o.streams?.length ?? 0) > 0) {
    // Kualitas dari daftar download Oploverz dipakai sbg pilihan kualitas (link file)
    const qualities: Record<string, string> = {};
    for (const dl of o.downloads ?? []) {
      if (!dl.resolution || !dl.url) continue;
      if (!qualities[dl.resolution]) qualities[dl.resolution] = dl.url;
    }
    return {
      title: o.title ?? o.episode_title ?? slug,
      streams: o.streams ?? [],
      qualities,
      downloads: o.downloads ?? [],
    };
  }
  const s = await getEpisodeSamehadaku(slug).catch(() => null);
  if (s && s.streams.length > 0) {
    const qualities: Record<string, string> = {};
    for (const st of s.streams) {
      if (st.quality) qualities[st.quality] = st.url;
    }
    return {
      title: s.title,
      streams: s.streams.map(({ name, url }) => ({ name, url })),
      qualities,
      downloads: [],
      releasedOn: s.releasedOn,
      hasPrev: s.hasPrev,
      prevSlug: s.prevSlug,
      hasNext: s.hasNext,
      nextSlug: s.nextSlug,
    };
  }
  return a ? { ...a, streams: a.streams ?? [], qualities: {}, downloads: [] } : null;
}
