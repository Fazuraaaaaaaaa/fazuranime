import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionHead } from "@/components/cards";
import { getDetail, getEpisode } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { detail } = await getDetail(slug);
    return { title: detail.title };
  } catch {
    return { title: "Episode" };
  }
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const ep = await getEpisode(slug).catch(() => null);
  if (!ep) notFound();
  const streams = ep.streams ?? [];

  return (
    <div>
      <Link
        href="javascript:history.back()"
        className="mb-4 inline-block text-sm font-semibold text-zinc-400 hover:text-white"
      >
        ← Kembali
      </Link>
      <h1 className="mb-5 text-xl font-extrabold md:text-2xl">{ep.title}</h1>

      {streams.length > 0 ? (
        <>
          <div className="aspect-video max-h-[70vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
            <iframe
              src={streams[0].url}
              allowFullScreen
              allow="autoplay; fullscreen"
              className="h-full w-full border-0"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {streams.map((s, i) => (
              <span
                key={i}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  i === 0
                    ? "bg-violet-600"
                    : "border border-white/10 bg-white/5 text-zinc-300"
                }`}
              >
                {s.name || `Server ${i + 1}`}
              </span>
            ))}
            <a
              href={streams[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:border-violet-500"
            >
              🔓 Buka di tab baru ↗
            </a>
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-zinc-500">
          Stream tidak tersedia untuk episode ini.
        </p>
      )}

      {(ep.downloads?.length ?? 0) > 0 && (
        <>
          <SectionHead title="⬇️ Download" />
          <div className="flex flex-wrap gap-2.5">
            {ep.downloads!.map((d, i) => (
              <a
                key={i}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:border-violet-500"
              >
                {d.name} [{d.resolution}]
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
