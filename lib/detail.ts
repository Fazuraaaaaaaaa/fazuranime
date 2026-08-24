import { getDetail, getDetailOploverz } from "@/lib/api";

/**
 * Ambil detail anime dengan fallback dua sumber:
 * Anoboy dulu (kualitas data lebih lengkap), lalu Oploverz
 * (wajib untuk daftar Tamat/Ongoing yang berasal dari sana).
 */
export async function getDetailAny(slug: string) {
  const a = await getDetail(slug).catch(() => null);
  if (a?.detail) return { detail: a.detail, source: "anoboy" as const };
  const o = await getDetailOploverz(slug).catch(() => null);
  if (o?.detail) return { detail: o.detail, source: "oploverz" as const };
  return null;
}
