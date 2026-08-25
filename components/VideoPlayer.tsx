"use client";

import { useEffect, useRef, useState } from "react";

/** URL video langsung (file mp4/webm) vs halaman embed (butuh iframe). */
function isDirectVideo(url: string) {
  return /\.(mp4|webm|m3u8)(\?|$)/i.test(url);
}

/**
 * Player full-bleed: iframe/video rata kiri-kanan, background hitam,
 * tombol play besar di tengah sebelum diputar.
 */
export default function VideoPlayer({
  sources,
}: {
  /** Daftar url per kualitas; key "default" selalu ada. */
  sources: Record<string, string>;
}) {
  const order = ["720p", "480p", "360p", "default"];
  const available = order.filter((k) => sources[k]);
  const [active, setActive] = useState(available[0] ?? "");
  const [started, setStarted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reset saat episode berganti
  const srcKey = Object.values(sources).join("|");
  useEffect(() => {
    setActive(order.filter((k) => sources[k])[0] ?? "");
    setStarted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey]);

  function start() {
    setStarted(true);
    wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const url = active ? sources[active] : undefined;
  const direct = url ? isDirectVideo(url) : false;

  return (
    <div
      ref={wrapRef}
      className="relative -mx-4 w-[calc(100%+2rem)] bg-black sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]"
      style={{ aspectRatio: "16 / 9", maxHeight: "78vh" }}
    >
      {started && url ? (
        direct ? (
          <video
            key={url}
            src={url}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full bg-black"
          />
        ) : (
          <iframe
            key={url}
            src={url}
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
            className="absolute inset-0 h-full w-full border-0"
            title="Player"
          />
        )
      ) : (
        /* Overlay play besar di tengah */
        <button
          onClick={start}
          className="group absolute inset-0 flex items-center justify-center bg-black"
          aria-label="Putar video"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-3xl text-white backdrop-blur transition group-hover:scale-110 group-hover:border-emerald-400/70 group-hover:bg-emerald-500/20 md:h-24 md:w-24">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
