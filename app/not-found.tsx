import Link from "next/link";
import { FazurMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="animate-fade-up py-24 text-center">
      <div className="mx-auto w-fit animate-float">
        <FazurMark size={72} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold">
        404 — Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-zinc-500">
        Anime yang kamu cari mungkin sudah pindah atau tidak ada.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 font-bold shadow-lg shadow-sky-950/50 transition hover:scale-[1.03]"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
