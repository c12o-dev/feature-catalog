"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ARTICLES = [
  { title: "朝の 15 分で整えるデスク環境", tag: "ワークスタイル", min: 4, grad: "from-amber-200 to-rose-200 dark:from-amber-900 dark:to-rose-950" },
  { title: "読みやすいフォームのための 7 つの原則", tag: "UI デザイン", min: 6, grad: "from-sky-200 to-indigo-200 dark:from-sky-900 dark:to-indigo-950" },
  { title: "小さなチームの振り返りテンプレート", tag: "チーム", min: 5, grad: "from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-950" },
];

export default function SkeletonFade() {
  const [run, setRun] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, [run]);

  const replay = () => {
    setLoaded(false);
    setRun((r) => r + 1);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">おすすめ記事</span>
        <Button size="sm" variant="outline" onClick={replay} disabled={!loaded}>
          <RotateCcw />
          もう一度読み込む
        </Button>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-busy={!loaded}>
        {ARTICLES.map((a, i) => (
          <li key={a.title} className="grid overflow-hidden rounded-lg border bg-card">
            {/* Skeleton and content share one grid cell: same box, no layout shift. */}
            <div
              aria-hidden
              className="col-start-1 row-start-1 p-3 transition-opacity duration-500"
              style={{ opacity: loaded ? 0 : 1, transitionDelay: loaded ? `${i * 90}ms` : "0ms" }}
            >
              <div className="aspect-[16/9] animate-pulse rounded-md bg-muted" />
              <div className="mt-3 h-2.5 w-1/3 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3.5 w-full animate-pulse rounded bg-muted" />
              <div className="mt-1.5 h-3.5 w-2/3 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-2.5 w-1/4 animate-pulse rounded bg-muted" />
            </div>
            <div
              aria-hidden={!loaded}
              className="col-start-1 row-start-1 p-3 transition-opacity duration-500"
              style={{ opacity: loaded ? 1 : 0, transitionDelay: loaded ? `${i * 90 + 120}ms` : "0ms" }}
            >
              <div className={`aspect-[16/9] rounded-md bg-gradient-to-br ${a.grad}`} />
              <div className="mt-3 text-xs text-muted-foreground">{a.tag}</div>
              <div className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5">{a.title}</div>
              <div className="mt-2 text-xs text-muted-foreground">{a.min} 分で読めます</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {loaded ? "記事を読み込みました" : "読み込み中"}
      </p>
    </div>
  );
}
