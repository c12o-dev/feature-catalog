"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const feed = [
  { name: "佐藤 美咲", initial: "佐", time: "3 分前", msg: "「Q4 ロードマップ」を作成しました", tag: "プロジェクト" },
  { name: "田中 健太", initial: "田", time: "12 分前", msg: "デザインレビューにコメントしました：「余白をもう少し広げたいです」", tag: "コメント" },
  { name: "鈴木 彩", initial: "鈴", time: "1 時間前", msg: "#284 のプルリクエストをマージしました", tag: "コード" },
];

export default function SkeletonLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="mx-auto w-full max-w-lg rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <h3 className="text-sm font-semibold">アクティビティ</h3>
        <Button size="sm" variant="ghost" onClick={() => setLoading(true)} disabled={loading}>
          <RefreshCw className="size-3.5" aria-hidden />
          再読み込み
        </Button>
      </div>
      <div aria-busy={loading} aria-live="polite" className="divide-y">
        <span role="status" className="sr-only">{loading ? "読み込み中…" : "3 件のアクティビティを読み込みました"}</span>
        {loading
          ? feed.map((_, i) => (
              <div key={i} aria-hidden className="flex items-start gap-3 px-4 py-3">
                <Skeleton className="size-9 shrink-0 rounded-full motion-reduce:animate-none" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-20 motion-reduce:animate-none" />
                    <Skeleton className="h-3 w-10 motion-reduce:animate-none" />
                  </div>
                  <Skeleton className={`h-3 motion-reduce:animate-none ${i === 1 ? "w-full" : "w-4/5"}`} />
                  {i === 1 && <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />}
                  <Skeleton className="h-4 w-14 rounded-full motion-reduce:animate-none" />
                </div>
              </div>
            ))
          : feed.map((f) => (
              <div key={f.name} className="flex items-start gap-3 px-4 py-3 motion-safe:animate-in motion-safe:fade-in">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-sm font-medium">{f.initial}</span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{f.name}</span>
                    <span className="text-xs text-muted-foreground">{f.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{f.msg}</p>
                  <span className="inline-block rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{f.tag}</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
