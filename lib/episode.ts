import { getEpisode, getEpisodeDefaultUrlSamehadaku } from "@/lib/api";

/** Ambil data episode dengan fallback tiga sumber (Anoboy -> Oploverz -> Samehadaku). */
export async function getEpisodeAny(slug: string) {
  const a = await getEpisode(slug).catch(() => null);
  if (a && (a.streams?.length ?? 0) > 0) return a;
  const { api } = await import("@/lib/api");
  const o = await api<{
    title: string;
    streams?: { name: string; url: string }[];
    downloads?: { name: string; resolution: string; url: string }[];
  }>(`/oploverz/episode/${slug}`).catch(() => null);
  if (o && (o.streams?.length ?? 0) > 0) return o;
  const s = await getEpisodeDefaultUrlSamehadaku(slug).catch(() => null);
  if (s && s.streams.length > 0) return { ...s, downloads: [] };
  return a ?? o;
}
