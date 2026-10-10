"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SearchItem } from "@/lib/catalog";
import { loadSearchIndex } from "@/lib/search-index";
import { Xray } from "@/components/shell/xray";

export function NotFoundSearch() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  useEffect(() => {
    let live = true;
    loadSearchIndex().then((list) => live && setItems(list));
    return () => {
      live = false;
    };
  }, []);
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return items.filter((i) => `${i.n} ${i.d} ${i.cat} ${i.s}`.toLowerCase().includes(s)).slice(0, 8);
  }, [q, items]);
  return (
    <div className="w-full max-w-xl">
      <label htmlFor="nf-q" className="sr-only">パターンを検索</label>
      <Xray slug="typeahead-search" as="div" place="br">
      <input
        id="nf-q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="探しているもの（例: トースト）"
        autoComplete="off"
        className="h-14 w-full rounded-full border border-line-2 bg-bg-1 px-6 text-base text-fg-1 outline-none placeholder:text-fg-3 focus:border-brand"
      />
      </Xray>
      <p aria-live="polite" className="sr-only">{q ? `${hits.length} 件` : ""}</p>
      {hits.length > 0 && (
        <ul className="mt-4 divide-y divide-line-1 rounded-2xl border border-line-1 bg-bg-1 text-left">
          {hits.map((h) => (
            <li key={h.s}>
              <Link href={`/p/${h.s}`} className="flex items-baseline gap-3 px-5 py-3 text-sm text-fg-2 hover:bg-bg-2 hover:text-fg-1">
                <span className="idx shrink-0 text-[11px]" style={{ color: `oklch(0.8 0.13 ${h.h})` }}>{h.c}</span>
                <span className="truncate">{h.n}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {q && hits.length === 0 && <p className="mt-4 text-sm text-fg-3">見つかりませんでした。別の言い方で試してください。</p>}
    </div>
  );
}
