"use client";

export interface VideoControlsProps {
  qualities: string[];
  activeQuality: string | null;
  onQuality: (q: string) => void;
  autoPlay: boolean;
  onAutoPlay: (v: boolean) => void;
  autoNext: boolean;
  onAutoNext: (v: boolean) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onList: () => void;
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-xs font-semibold text-zinc-300"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-[1.125rem]" : "left-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

const btn =
  "flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold transition enabled:hover:border-white/25 disabled:opacity-35 disabled:cursor-not-allowed";

export default function VideoControls({
  qualities,
  activeQuality,
  onQuality,
  autoPlay,
  onAutoPlay,
  autoNext,
  onAutoNext,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onList,
}: VideoControlsProps) {
  return (
    <div className="mt-3 flex flex-col gap-3">
      {/* Baris atas: kualitas kiri — toggles kanan */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          {["360p", "480p", "720p"].map((q) => {
            const available = qualities.includes(q);
            const active = activeQuality === q;
            return (
              <button
                key={q}
                onClick={() => available && onQuality(q)}
                disabled={!available}
                title={available ? `Kualitas ${q}` : `${q} tidak tersedia untuk episode ini`}
                className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
                  active
                    ? "bg-emerald-400 text-black shadow shadow-emerald-900/60"
                    : available
                      ? "border border-emerald-500/40 bg-white/5 text-emerald-300 hover:border-emerald-300 hover:text-emerald-200"
                      : "cursor-not-allowed border border-white/10 bg-white/[0.03] text-zinc-600 line-through"
                }`}
              >
                {q}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Toggle label="Auto Play" checked={autoPlay} onChange={onAutoPlay} />
          <Toggle label="Auto Next" checked={autoNext} onChange={onAutoNext} />
          <button
            onClick={() => {
              const v = document.querySelector("video") ?? document.querySelector("iframe");
              v?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-emerald-400/60 hover:text-emerald-300"
          >
            Skip OP →
          </button>
        </div>
      </div>

      {/* Baris bawah: Prev | List | Next */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2.5 sm:gap-3">
        <button onClick={onPrev} disabled={!hasPrev} className={btn}>
          ‹ Prev
        </button>
        <button
          onClick={onList}
          className={`${btn} px-5`}
          aria-label="Buka daftar episode"
        >
          ☰ List
        </button>
        <button onClick={onNext} disabled={!hasNext} className={btn}>
          Next ›
        </button>
      </div>
    </div>
  );
}
