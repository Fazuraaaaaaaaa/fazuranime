import { getEpisode } from "@/lib/api";

/** Ambil data episode dengan fallback dua sumber (Anoboy -> Oploverz). */
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
  return a ?? o;
}
