import Link from "next/link";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-sky-400" />
      <p className="mt-4 text-sm font-semibold text-zinc-500">Memuat...</p>
      <Link href="/" className="mt-2 text-xs text-sky-400 hover:text-sky-300">
        FazurAnime
      </Link>
    </div>
  );
}
