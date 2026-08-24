import type { Metadata } from "next";
import Link from "next/link";
import { AnimeGrid, SectionHead } from "@/components/cards";
import { getAZ } from "@/lib/api";

export const metadata: Metadata = { title: "Daftar Anime A-Z" };

const LETTERS = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Props {
  searchParams: Promise<{ show?: string }>;
}

async function List({ show }: { show?: string }) {
  const letter = (show && /^[A-Z#]$/i.test(show) ? show.toUpperCase() : "A");
  const j = await getAZ(letter).catch(() => null);
  const items = j?.anime_list ?? [];
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {LETTERS.map((l) => (
          <Link
            key={l}
            href={`/az?show=${l}`}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
              l === letter
                ? "bg-violet-600"
                : "border border-white/10 bg-white/5 hover:border-violet-500"
            }`}
          >
            {l}
          </Link>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">
          Tidak ada judul dengan huruf {letter}.
        </p>
      ) : (
        <AnimeGrid items={items} />
      )}
    </>
  );
}

export default function AZPage({ searchParams }: Props) {
  // bungkus promise agar halaman tetap streaming dengan Suspense-friendly
  const content = searchParams.then((sp) => <List show={sp.show} />);
  return (
    <div>
      <SectionHead title="🔤 Daftar Anime A-Z" />
      {content}
    </div>
  );
}
