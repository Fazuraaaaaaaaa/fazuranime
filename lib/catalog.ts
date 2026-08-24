import { itemSlug, type AnimeItem } from "@/lib/api";
import catalog from "@/src/data/catalog.json";
import yearsRaw from "@/src/data/years.json";

export interface CatalogEntry extends AnimeItem {
  year?: number | null;
}

const years = yearsRaw as Record<string, number>;
export const catalogAll = (catalog as AnimeItem[]).map((c) => ({
  ...c,
  year: years[c.slug] ?? null,
}));

/** Katalog terurut: terbaru dulu, tanpa tahun dianggap paling baru. */
export const catalogSorted = [...catalogAll].sort(
  (a, b) => (b.year ?? 9999) - (a.year ?? 9999),
);

export const catalogBySlug = new Map<string, CatalogEntry>(
  catalogSorted.map((c) => [c.slug ?? "", c]),
);

export function paginate<T>(arr: T[], page: number, per = 30): T[] {
  const start = (page - 1) * per;
  return arr.slice(start, start + per);
}

export const totalPages = (arr: unknown[], per = 30) =>
  Math.max(1, Math.ceil(arr.length / per));

export { itemSlug };
