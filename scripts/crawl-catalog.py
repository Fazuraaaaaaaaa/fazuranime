#!/usr/bin/env python3
"""
Crawl katalog anime dari API Sankavollerei secara PELAN (aman rate-limit)
dan simpan hasilnya sebagai file statis di src/data/.

Hasil:
  - catalog.json      : semua judul (slug, title, poster, status, type, letter, page)
  - years.json        : { slug: tahun rilis } — diambil dari endpoint detail

Rate limit API: 50 req/menit (ban setelah warning berulang).
Script ini default jalan ~25 req/menit. Jalankan ulang untuk refresh:
    python scripts/crawl-catalog.py            # list saja (cepat)
    python scripts/crawl-catalog.py --years    # list + tahun (lama)
"""
import json
import os
import re
import sys
import time
import urllib.request
from pathlib import Path

API = "https://www.sankavollerei.web.id/anime"
OUT = Path(__file__).resolve().parent.parent / "src" / "data"
LETTERS = list("#ABCDEFGHIJKLMNOPQRSTUVWXYZ")
DELAY = 1.3  # detik antar request (~46 req/menit worst case; aman)


def get(path: str) -> dict | None:
    url = f"{API}{path}"
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FazurAnimeCrawler/1.0",
                },
            )
            with urllib.request.urlopen(req, timeout=30) as res:
                j = json.loads(res.read().decode())
            if j.get("status") == "success":
                return j
            print(f"  ! non-success: {j.get('message', '?')[:60]}", flush=True)
            return None
        except Exception as e:
            print(f"  ! retry {attempt+1}: {e}", flush=True)
            time.sleep(5 * (attempt + 1))
    return None


def item_slug(it: dict) -> str | None:
    s = it.get("slug")
    if s and s != "anime":
        return s
    u = it.get("url") or ""
    if u:
        m = u.rstrip("/").split("/")
        last = m[-1] if m else None
        if last and last != "anime":
            return last
    return None


def crawl_list():
    catalog = []
    for L in LETTERS:
        page = 1
        while True:
            j = get(f"/anoboy/az-list?page={page}&show={L}")
            items = (j or {}).get("anime_list") or []
            for it in items:
                slug = item_slug(it)
                if not slug:
                    continue
                catalog.append(
                    {
                        "slug": slug,
                        "title": it.get("title", ""),
                        "poster": it.get("poster", ""),
                        "status": it.get("status"),
                        "type": it.get("type"),
                    }
                )
            if not j or not (j.get("pagination", {}) or {}).get("hasNext"):
                break
            page += 1
            time.sleep(DELAY)
        print(f"[{L}] total sejauh ini: {len(catalog)}", flush=True)
        time.sleep(DELAY)

    OUT.mkdir(parents=True, exist_ok=True)
    seen = {}
    for c in catalog:
        seen.setdefault(c["slug"], c)
    (OUT / "catalog.json").write_text(
        json.dumps(list(seen.values()), ensure_ascii=False), encoding="utf-8"
    )
    print(f"DONE: {len(seen)} unique titles -> {OUT/'catalog.json'}", flush=True)
    return list(seen.keys())


def crawl_years(slugs: list[str]):
    years_path = OUT / "years.json"
    years = json.loads(years_path.read_text()) if years_path.exists() else {}
    todo = [s for s in slugs if s not in years]
    print(f"Tahun sudah ada: {len(years)}, akan di-crawl: {len(todo)}", flush=True)
    ok = fail = 0
    for i, slug in enumerate(todo):
        j = get(f"/anoboy/anime/{slug}")
        year = None
        if j:
            info = ((j.get("detail") or {}).get("info")) or {}
            rel = str(info.get("released") or "")
            season = str(info.get("season") or "")
            m = re.search(r"(19|20)\d{2}", rel) or re.search(r"(19|20)\d{2}", season)
            year = int(m.group()) if m else None
        if year:
            years[slug] = year
            ok += 1
        else:
            fail += 1
        if (i + 1) % 25 == 0:
            years_path.write_text(json.dumps(years), encoding="utf-8")
            print(f"  ...{i+1}/{len(todo)} (ok={ok} fail={fail})", flush=True)
        time.sleep(DELAY)
    years_path.write_text(json.dumps(years), encoding="utf-8")
    print(f"DONE years: +{ok} ok, {fail} tanpa tahun -> {years_path}", flush=True)


if __name__ == "__main__":
    slugs = crawl_list()
    if "--years" in sys.argv:
        crawl_years(slugs)
