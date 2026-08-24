import type { Metadata } from "next";
import Link from "next/link";
import { AnimeGrid, Pager, SectionHead } from "@/components/cards";
import { getAZ } from "@/lib/api";

export const metadata: Metadata = { title: "Daftar Anime A-Z" };

const LETTERS = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Props {
  searchParams: Promise<{ show?: string; page?: string }>;
}

async function List({ show, page }: { show?: string; page: number }) {
  const letter = show && /^[A-Z#]$/i.test(show) ? show.toUpperCase() : "A";
  const j = await getAZ(letter, page).catch(() => null);
  const items = j?.anime_list ?? [];
  const hasNext = j?.pagination?.hasNext ?? false;

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {LETTERS.map((l) => (
          <Link
            key={l}
            href={`/az?show=${l}`}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
              l === letter
                ? "bg-gradient-to-r from-sky-600 to-violet-600"
                : "border border-white/10 bg-white/5 hover:border-sky-400"
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
      <Pager
        base={`/az?show=${letter}&page=`}
        page={page}
        hasMore={hasNext}
      />
    </>
  );
}

export default async function AZPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  return (
    <div>
      <SectionHead title={`🔤 Daftar Anime A-Z${sp.show ? ` — ${sp.show.toUpperCase()}` : ""}`} />
      <List show={sp.show} page={page} />
    </div>
  );
}
