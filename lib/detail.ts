import { getDetail, getDetailOploverz, getDetailSamehadaku } from "@/lib/api";

/**
 * Ambil detail anime dengan fallback tiga sumber:
 * Anoboy dulu (kualitas data lebih lengkap), lalu Oploverz
 * (wajib untuk daftar Tamat/Ongoing yang berasal dari sana),
 * terakhir Samehadaku (judul lama seperti K-On!).
 */
export async function getDetailAny(slug: string) {
  const a = await getDetail(slug).catch(() => null);
  if (a?.detail) return { detail: a.detail, source: "anoboy" as const };
  const o = await getDetailOploverz(slug).catch(() => null);
  if (o?.detail) return { detail: o.detail, source: "oploverz" as const };
  const s = await getDetailSamehadaku(slug).catch(() => null);
  if (s?.detail?.title) return { detail: s.detail, source: "samehadaku" as const };
  return null;
}
