"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-24 text-center">
      <p className="text-6xl">⚠️</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold">Terjadi kesalahan</h1>
      <p className="mt-2 text-zinc-500">{error.message || "Gagal memuat data dari API."}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 font-bold"
      >
        Coba Lagi
      </button>
    </div>
  );
}
