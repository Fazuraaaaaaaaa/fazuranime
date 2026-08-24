import type { Metadata } from "next";
import Link from "next/link";
import { SectionHead } from "@/components/cards";
import { getSchedule } from "@/lib/api";

export const metadata: Metadata = { title: "Jadwal Rilis" };

export const revalidate = 900;

const DAY_ID = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAY_NAME: Record<string, string> = {
  sunday: "Minggu",
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
};

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ hari?: string }>;
}) {
  const j = await getSchedule();
  const schedule = j.schedule ?? {};
  const days = Object.keys(DAY_NAME).filter((k) => schedule[k]?.length);
  const todayIdx = (new Date().getDay() + 6) % 7; // Senin=0 di UI, tapi getDay Minggu=0
  const spHari = (await searchParams).hari;
  const current =
    spHari && DAY_ID.includes(spHari)
      ? spHari
      : DAY_ID[new Date().getDay()] ?? days[0];
  void todayIdx;
  const items = schedule[current] ?? [];

  return (
    <div>
      <SectionHead title="📅 Jadwal Rilis Anime" />
      <div className="mb-6 flex flex-wrap gap-2">
        {days.map((d) => (
          <Link
            key={d}
            href={`/jadwal?hari=${d}`}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              d === current
                ? "bg-violet-600"
                : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            {DAY_NAME[d]}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((a) => (
          <Link
            key={a.slug}
            href={`/anime/${a.slug}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 transition hover:border-violet-500"
          >
            <span className="text-sm font-semibold">{a.title}</span>
            <span className="text-xs font-semibold text-violet-300">{a.episode_info}</span>
          </Link>
        ))}
        {items.length === 0 && (
          <p className="py-16 text-center text-zinc-500">Tidak ada jadwal hari ini.</p>
        )}
      </div>
    </div>
  );
}
