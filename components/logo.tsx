import Link from "next/link";

/**
 * Logo FazurAnime — SVG play-button "F" dengan gradient sky→violet,
 * dipakai di header (dengan wordmark) dan sebagai favicon/icon.
 */
export function FazurMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="fz-g" x1="4" y1="4" x2="44" y2="44">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#fz-g)" />
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        stroke="white"
        strokeOpacity=".25"
      />
      {/* F letterform */}
      <path
        d="M17 35V14h14v4.6H22.5v3.9H30V27h-7.5v8H17Z"
        fill="white"
      />
      {/* play accent */}
      <path d="M31.5 24.5 38 20v10l-6.5-5.5Z" fill="white" fillOpacity=".85" />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
        <FazurMark size={compact ? 30 : 36} />
      </span>
      <span
        className={`logo-shimmer bg-gradient-to-r from-sky-400 via-violet-400 to-sky-400 bg-clip-text font-display font-extrabold tracking-tight text-transparent ${
          compact ? "text-lg" : "text-[22px]"
        }`}
      >
        Fazur<span className="font-semibold">Anime</span>
      </span>
    </Link>
  );
}
