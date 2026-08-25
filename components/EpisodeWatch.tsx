"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import VideoControls from "./VideoControls";

export interface WatchData {
  title: string;
  streams: { name: string; url: string }[];
  qualities: Record<string, string>;
  hasPrev?: boolean;
  prevSlug?: string | null;
  hasNext?: boolean;
  nextSlug?: string | null;
}

/**
 * Satu sumber URL embed per kualitas:
 * - kualitas eksplisit dari API dipakai bila ada
 * - selain itu semua tombol kualitas memakai stream default (bukan mati)
 */
function buildSources(w: WatchData): Record<string, string> {
  const def = w.streams[0]?.url;
  if (!def) return {};
  const sources: Record<string, string> = { default: def };
  for (const q of ["360p", "480p", "720p"]) {
    const url = w.qualities[q];
    // Hanya pakai link kualitas yang bisa di-embed (bukan link download file)
    if (url && !/^https?:\/\/(acefile|filedon|gdrive|drive\.google|mirror)/i.test(url)) {
      sources[q] = url;
    }
  }
  return sources;
}

const STORAGE_KEY = "fz-player-prefs";

export default function EpisodeWatch({ watch }: { watch: WatchData }) {
  const router = useRouter();
  const sources = useMemo(() => buildSources(watch), [watch]);

  const [prefs, setPrefs] = useState<{ autoPlay: boolean; autoNext: boolean }>({
    autoPlay: false,
    autoNext: false,
  });
  const [activeQuality, setActiveQuality] = useState<string | null>(null);

  /** Sumber aktif: kualitas terpilih, atau default. */
  const effectiveSources = useMemo(() => {
    if (activeQuality && sources[activeQuality]) {
      return { default: sources[activeQuality], ...sources };
    }
    return sources;
  }, [sources, activeQuality]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function savePrefs(next: typeof prefs) {
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  /** Transisi smooth ke episode lain via router (server component reload). */
  const gotoEpisode = useCallback(
    (slug: string) => {
      router.push(`/episode/${slug}`);
    },
    [router],
  );

  // Auto Next: ketika stream iframe selesai dimuat + Auto Next aktif, tunggu durasi
  // iframe tidak bisa dipantau (cross-origin), jadi Auto Next memakai timer default 24 menit
  // ATAU langsung pindah saat user klik Next. Timer hanya aktif jika Auto Next ON.
  const [autoNextTimer, setAutoNextTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (autoNextTimer) clearTimeout(autoNextTimer); }, [autoNextTimer]);
  useEffect(() => {
    if (!prefs.autoNext || !watch.nextSlug) return;
    const t = setTimeout(() => gotoEpisode(watch.nextSlug!), 24 * 60 * 1000);
    setAutoNextTimer(t);
    return () => clearTimeout(t);
  }, [prefs.autoNext, watch.nextSlug, gotoEpisode]);

  return (
    <div>
      <VideoPlayer sources={effectiveSources} />
      <VideoControls
        qualities={["360p", "480p", "720p"].filter((q) => Boolean(sources[q]))}
        activeQuality={activeQuality}
        onQuality={(q) => setActiveQuality((prev) => (prev === q ? null : q))}
        autoPlay={prefs.autoPlay}
        onAutoPlay={(v) => savePrefs({ ...prefs, autoPlay: v })}
        autoNext={prefs.autoNext}
        onAutoNext={(v) => savePrefs({ ...prefs, autoNext: v })}
        hasPrev={Boolean(watch.hasPrev && watch.prevSlug)}
        hasNext={Boolean(watch.hasNext && watch.nextSlug)}
        onPrev={() => watch.prevSlug && gotoEpisode(watch.prevSlug)}
        onNext={() => watch.nextSlug && gotoEpisode(watch.nextSlug)}
        onList={() =>
          document
            .querySelector("[data-episode-list]")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      />
    </div>
  );
}
