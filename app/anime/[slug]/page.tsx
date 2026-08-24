import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionHead } from "@/components/cards";
import { getDetailAny } from "@/lib/detail";
import { getEpisode } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = (await getDetailAny(slug).catch(() => null)) ?? {
    detail: null,
    source: "anoboy" as const,
  };
  return { title: res.detail?.title ?? "Anime" };
}

/** Deteksi slug/judul yang merupakan episode, mis. "...episode-1175-subtitle-indonesia". */
function looksLikeEpisode(slug: string) {
  return /episode|ep-?\d/i.test(slug);
}

export default async function AnimeDetailPage({ params }: Props) {
  const { slug } = await params;

  let res = await getDetailAny(slug);

  // Fallback 1: banyak item di daftar rilisan sebenarnya adalah EPISODE.
  if (!res && looksLikeEpisode(slug)) {
    const ep = await getEpisode(slug).catch(() => null);
    if (ep && (ep.streams?.length ?? 0) > 0) {
      redirect(`/episode/${slug}`);
    }
  }

  if (!res) notFound();
  const { detail: d } = res;
  const info = d.info ?? {};
  const eps = (d.episode_list ?? []).slice().reverse();

  const cells = [
    ["Status", info.status],
    ["Tipe", info.type],
    ["Episode", info.episodes],
    ["Rilis", info.released],
  ].filter((c) => c[1]);

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-block text-sm font-semibold text-zinc-400 hover:text-white"
      >
        ← Beranda
      </Link>

      <div className="flex flex-wrap gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={d.poster}
          alt={d.title}
          className="h-auto w-48 flex-shrink-0 self-start rounded-2xl border border-white/10 md:w-60"
        />
        <div className="min-w-[280px] flex-1">
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">{d.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {[info.status, info.type].filter(Boolean).map((v) => (
              <span
                key={v}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300"
              >
                {v}
              </span>
            ))}
          </div>
          {cells.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {cells.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">{k}</p>
                  <p className="mt-0.5 text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
          )}
          {(d.genres?.length ?? 0) > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {d.genres!.map((g) => (
                <Link
                  key={g.slug}
                  href={`/genre/${g.slug}`}
                  className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300 hover:border-sky-400"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          )}
          <h2 className="mb-2 mt-6 font-bold">Sinopsis</h2>
          <p className="whitespace-pre-line leading-relaxed text-zinc-300">
            {d.synopsis || "-"}
          </p>
        </div>
      </div>

      {eps.length > 0 && (
        <>
          <SectionHead title={`📜 Daftar Episode (${eps.length})`} />
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eps.map((e) => (
              <Link
                key={e.slug}
                href={`/episode/${e.slug}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-sky-500 hover:text-sky-300"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-fuchsia-500 text-xs text-white">
                  ▶
                </span>
                <span className="truncate">{e.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
