import Link from "next/link";
import { AnimeGrid, SectionHead } from "@/components/cards";
import { FazurMark } from "@/components/logo";
import { getCompleted, getHome, getOngoing } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const [home, ongoing, completed] = await Promise.all([
    getHome(),
    getOngoing(1).catch(() => null),
    getCompleted(1).catch(() => null),
  ]);
  const latest = home.anime_list ?? [];
  const feat = latest.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1a2e] via-[#12142a] to-[#160f2b] px-8 py-12 md:px-12">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="animate-float pointer-events-none absolute right-10 top-1/2 hidden opacity-25 lg:block">
          <FazurMark size={140} />
        </div>
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="animate-fade-up">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
              ✨ Streaming Anime Sub Indo
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
              Nonton Anime{" "}
              <span className="logo-shimmer bg-gradient-to-r from-sky-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                Subtitle Indonesia
              </span>
              <br />
              Tanpa Iklan, Gratis!
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">
              Ribuan judul anime dengan kualitas HD dan update harian. Rilisan
              terbaru dari Anoboy &amp; Oploverz langsung di FazurAnime.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {["✅ Tanpa Iklan", "📺 Kualitas HD", "🇮🇩 Sub Indonesia", "🔄 Update Harian"].map(
                (b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300"
                  >
                    {b}
                  </span>
                ),
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/az"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 font-bold shadow-lg shadow-sky-950/50 transition hover:scale-[1.03] hover:shadow-sky-900/60"
              >
                Jelajahi Semua Anime
              </Link>
              <Link
                href="/jadwal"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold transition hover:border-sky-400/60 hover:text-sky-300"
              >
                📅 Jadwal Rilis
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {feat.map((f) => (
              <Link
                key={f.slug}
                href={`/anime/${f.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur transition hover:border-sky-400/60 hover:bg-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.poster}
                  alt=""
                  className="h-20 w-14 flex-shrink-0 rounded-lg object-cover"
                />
                <div>
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">
                    {f.title}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-sky-300">
                    {f.episode} · {f.type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionHead title="🆕 Rilisan Terbaru" />
      <AnimeGrid items={latest} />

      <SectionHead title="🔥 Sedang Tayang" href="/ongoing" />
      {ongoing ? <AnimeGrid items={ongoing.anime_list.slice(0, 12)} /> : null}

      <SectionHead title="🏁 Anime Tamat" href="/completed" />
      {completed ? <AnimeGrid items={completed.anime_list.slice(0, 12)} /> : null}
    </div>
  );
}
