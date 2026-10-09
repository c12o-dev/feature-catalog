"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function Bone({ className }: { className: string }) {
  return <div className={`rounded bg-muted ${className}`} />;
}

function SkeletonCard({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3">
        <Bone className="size-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Bone className="h-3 w-2/5" />
          <Bone className="h-2.5 w-1/4" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Bone className="h-2.5 w-full" />
        <Bone className="h-2.5 w-11/12" />
        <Bone className="h-2.5 w-3/5" />
      </div>
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10"
          initial={{ x: "-100%" }}
          animate={{ x: "250%" }}
          transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
        />
      )}
    </div>
  );
}

const POSTS = [
  { name: "佐藤 美咲", meta: "デザイン · 5 分前", body: "新しいオンボーディング画面のラフを共有しました。余白の取り方について意見ください。" },
  { name: "田中 蓮", meta: "フロントエンド · 12 分前", body: "一覧ページの初回表示を 1.8 秒から 0.9 秒に短縮できました。" },
];

export default function Shimmer() {
  const reduce = useReducedMotion() ?? false;
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">タイムライン</span>
        <Button size="sm" variant="outline" onClick={() => setLoaded((v) => !v)}>
          {loaded ? <RotateCcw /> : null}
          {loaded ? "読み込み中に戻す" : "読み込み完了にする"}
        </Button>
      </div>
      <div aria-busy={!loaded} aria-live="polite" className="space-y-2">
        {loaded
          ? POSTS.map((p) => (
              <div key={p.name} className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-medium">
                    {p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.meta}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))
          : [0, 1].map((i) => <SkeletonCard key={i} reduce={reduce} />)}
        {!loaded && <span className="sr-only">読み込み中</span>}
      </div>
    </div>
  );
}
