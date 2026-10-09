"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const PAGE = 6;
const TOTAL = 30;
const TITLES = [
  "週末に試したいコーヒーの淹れ方",
  "小さなチームのための週次レビュー",
  "雨の日の写真を上手に撮るコツ",
  "読みやすい日本語 UI 文言の書き方",
  "通勤時間で読み切れる短編 5 選",
  "ベランダ菜園、最初の一ヶ月",
  "キーボードだけで完結する作業術",
  "旅先で見つけた路地裏の喫茶店",
];
const AUTHORS = ["佐藤 美咲", "田中 蓮", "鈴木 葵", "高橋 湊", "伊藤 結衣"];

type Item = { id: number; title: string; author: string; min: number };

function makeItems(from: number, count: number): Item[] {
  return Array.from({ length: Math.min(count, TOTAL - from) }, (_, i) => {
    const id = from + i + 1;
    return {
      id,
      title: TITLES[(id * 3) % TITLES.length],
      author: AUTHORS[(id * 7) % AUTHORS.length],
      min: 3 + ((id * 5) % 9),
    };
  });
}

export default function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>(() => makeItems(0, PAGE));
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = items.length >= TOTAL;

  useEffect(() => {
    if (loading || done) return;
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        setLoading(true);
        timer.current = setTimeout(() => {
          setItems((it) => [...it, ...makeItems(it.length, PAGE)]);
          setLoading(false);
        }, 700);
      },
      { root: rootRef.current, rootMargin: "40px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, done]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">新着記事</span>
        <span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
          {items.length} / {TOTAL} 件
        </span>
      </div>
      <div ref={rootRef} className="h-64 overflow-y-auto" tabIndex={0} aria-label="記事フィード">
        <ul className="divide-y" aria-busy={loading}>
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 px-3 py-2.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-xs font-medium tabular-nums text-muted-foreground">
                {it.id}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm">{it.title}</p>
                <p className="text-xs text-muted-foreground">
                  {it.author} · {it.min} 分で読めます
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div ref={sentinel} className="flex h-12 items-center justify-center text-xs text-muted-foreground">
          {done ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              すべて表示しました
            </span>
          ) : loading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3.5 motion-safe:animate-spin" />
              読み込み中…
            </span>
          ) : (
            "スクロールで続きを読み込みます"
          )}
        </div>
      </div>
    </div>
  );
}
