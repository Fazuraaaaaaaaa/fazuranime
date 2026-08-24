const API = "https://www.sankavollerei.web.id/anime";

export interface AnimeItem {
  title: string;
  slug: string;
  poster?: string;
  episode?: string;
  type?: string;
  status?: string;
  url?: string;
  oploverz_url?: string;
  /** Hanya ada pada item berupa episode: slug anime induknya. */
  animeSlug?: string;
}

export interface EpisodeItem {
  slug: string;
  title: string;
  episode?: string;
  release_date?: string;
}

export interface AnimeDetail {
  title: string;
  poster?: string;
  synopsis?: string;
  info?: Record<string, string>;
  genres?: { name: string; slug: string }[];
  episode_list?: EpisodeItem[];
}

interface ApiJson {
  status: string;
  message?: string;
  [k: string]: unknown;
}

/** Fetch dari API Sankavollerei dengan cache per-request Next.js (60 detik). */
export async function api<T>(path: string): Promise<T> {
  const res = await fetch(API + path, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const j: ApiJson = await res.json();
  if (j.status !== "success") throw new Error(j.message || "API error");
  return j as T;
}

/** Ambil slug anime yang valid dari item list (key beda-beda antar endpoint). */
export function itemSlug(item: AnimeItem): string | null {
  if (item.slug && item.slug !== "anime") return item.slug;
  const u = item.url || item.oploverz_url || "";
  if (!u) return null;
  return u.replace(/\/+$/, "").split("/").pop() || null;
}

/** Ambil slug ANIME dari item list — menangani item yang berupa episode. */
export function animeSlugOf(item: AnimeItem): string | null {
  if ((item as { animeSlug?: string }).animeSlug) {
    return (item as { animeSlug?: string }).animeSlug!;
  }
  const s = itemSlug(item);
  if (!s) return null;
  // "one-piece-episode-1175-subtitle-indonesia" -> "one-piece"
  // "naruto-shippuuden-episode-end" -> "naruto-shippuuden"
  const m = s.match(/^(.*?)-episode-/i);
  return m ? m[1] : s;
}
export async function getHome() {
  return api<{ anime_list: AnimeItem[] }>("/anoboy/home?page=1");
}
export async function getOngoing(page: number) {
  return api<{ anime_list: AnimeItem[] }>(`/oploverz/ongoing?page=${page}`);
}
export async function getCompleted(page: number) {
  return api<{ anime_list: AnimeItem[] }>(`/oploverz/completed?page=${page}`);
}
export async function getSearch(q: string) {
  return api<{ anime_list: AnimeItem[] }>(`/anoboy/search/${encodeURIComponent(q)}?page=1`);
}
export async function getDetail(slug: string) {
  return api<{ detail: AnimeDetail }>(`/anoboy/anime/${slug}`);
}
export async function getEpisode(slug: string) {
  return api<{
    title: string;
    streams?: { name: string; url: string }[];
    downloads?: { name: string; resolution: string; url: string }[];
  }>(`/anoboy/episode/${slug}`);
}
export async function getSchedule() {
  return api<{
    schedule: Record<string, { title: string; slug: string; episode_info?: string }[]>;
  }>("/oploverz/schedule");
}
export async function getGenres() {
  return api<{ genres: { name: string; slug: string }[] }>("/anoboy/genres");
}
export async function getGenreList(slug: string, page: number) {
  return api<{ anime_list: AnimeItem[] }>(`/anoboy/genre/${slug}?page=${page}`);
}
export async function getAZ(letter: string, page: number = 1) {
  return api<{
    anime_list: AnimeItem[];
    pagination?: { hasNext: boolean; hasPrev: boolean; currentPage: number };
  }>(`/anoboy/az-list?page=${page}&show=${letter}`);
}
