import Link from "next/link";
import { itemSlug, type AnimeItem } from "@/lib/api";

export function AnimeCard({ item }: { item: AnimeItem }) {
  const slug = itemSlug(item);
  const ep = item.episode?.replace(/^Ep\s*/, "") ?? "";
  const showEp = ep && ep !== "Ongoing" && ep !== "Completed";
  const meta = [item.type, item.status].filter(Boolean).join(" • ");
  return (
    <Link
      href={`/anime/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/60 hover:shadow-xl hover:shadow-sky-950/50"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[#151827]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.poster}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-100">
            ▶
          </span>
        </div>
        {showEp && (
          <span className="absolute bottom-2 left-2 rounded-md bg-gradient-to-r from-sky-600 to-violet-600 px-2 py-0.5 text-xs font-bold shadow">
            {ep}
          </span>
        )}
        {item.status === "Completed" && (
          <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-emerald-400 backdrop-blur">
            Tamat
          </span>
        )}
        {"year" in item && typeof item.year === "number" && item.year > 0 ? (
          <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-sky-300 backdrop-blur">
            {String(item.year)}
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-snug transition-colors group-hover:text-sky-300">
          {item.title}
        </h3>
        {meta && <p className="mt-1.5 text-xs text-zinc-500">{meta}</p>}
      </div>
    </Link>
  );
}

export function AnimeGrid({ items }: { items: AnimeItem[] }) {
  return (
    <div className="grid animate-fade-up grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item, i) => (
        <AnimeCard key={`${itemSlug(item) ?? i}-${i}`} item={item} />
      ))}
    </div>
  );
}

export function SectionHead({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-4 mt-10 flex items-center justify-between first:mt-0">
      <h2 className="flex items-center gap-2.5 font-display text-xl font-extrabold">
        <span className="h-5 w-1 rounded bg-gradient-to-b from-sky-400 to-violet-500" />
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
        >
          Lihat semua →
        </Link>
      )}
    </div>
  );
}

export function Pager({
  base,
  page,
  hasMore,
}: {
  base: string;
  page: number;
  hasMore: boolean;
}) {
  const cls =
    "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:border-sky-400 hover:text-sky-300";
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      {page > 1 && (
        <Link href={`${base}${page - 1}`} className={cls}>
          ← Sebelumnya
        </Link>
      )}
      <span className="rounded-lg bg-gradient-to-r from-sky-600 to-violet-600 px-4 py-2 text-sm font-bold shadow-lg shadow-sky-950/40">
        Halaman {page}
      </span>
      {hasMore && (
        <Link href={`${base}${page + 1}`} className={cls}>
          Berikutnya →
        </Link>
      )}
    </div>
  );
}
