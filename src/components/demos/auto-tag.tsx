"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tag = { name: string; score: number };

const ARTICLE = {
  title: "Server Components でフォームの送信処理をシンプルにする",
  body: "React 19 の Server Actions を使うと、API ルートを書かずにフォーム送信を扱えます。バリデーションとエラー表示、楽観的更新までを一つの流れで実装する方法をまとめました。",
};

const SUGGESTED: Tag[] = [
  { name: "React", score: 0.97 },
  { name: "フォーム", score: 0.92 },
  { name: "Server Actions", score: 0.88 },
  { name: "バリデーション", score: 0.74 },
  { name: "楽観的更新", score: 0.61 },
];

export default function AutoTag() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [tags, setTags] = useState<Tag[]>([]);
  const [removed, setRemoved] = useState<Tag[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const generate = () => {
    setState("loading");
    setTags([]);
    setRemoved([]);
    timer.current = setTimeout(() => {
      setTags(SUGGESTED);
      setState("done");
    }, 900);
  };

  const remove = (t: Tag) => {
    setTags((ts) => ts.filter((x) => x.name !== t.name));
    setRemoved((r) => [...r, t]);
  };
  const restore = (t: Tag) => {
    setRemoved((r) => r.filter((x) => x.name !== t.name));
    setTags((ts) => [...ts, t].sort((a, b) => b.score - a.score));
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4">
      <article className="space-y-1">
        <h3 className="text-sm font-medium">{ARTICLE.title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{ARTICLE.body}</p>
      </article>

      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <span className="text-xs font-medium">タグ</span>
        <Button size="sm" variant={state === "done" ? "ghost" : "outline"} onClick={generate} disabled={state === "loading"}>
          {state === "loading" ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {state === "done" ? "再生成" : state === "loading" ? "解析中…" : "AI でタグ付け"}
        </Button>
      </div>

      <div aria-live="polite" className="min-h-8">
        {state === "idle" && <p className="text-xs text-muted-foreground">本文からタグを提案します。</p>}
        {state === "loading" && (
          <div className="flex gap-1.5">
            <span className="sr-only">解析中</span>
            {[56, 72, 48].map((w) => (
              <span key={w} className="h-6 animate-pulse rounded-full bg-muted" style={{ width: w }} />
            ))}
          </div>
        )}
        {state === "done" && (
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li
                key={t.name}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border py-0.5 pl-2 pr-1 text-xs",
                  t.score >= 0.8 ? "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/50" : "border-dashed",
                )}
              >
                <Sparkles className="size-3 text-violet-600 dark:text-violet-400" aria-hidden />
                {t.name}
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  <span className="sr-only">確信度 </span>
                  {Math.round(t.score * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => remove(t)}
                  aria-label={`タグ「${t.name}」を削除`}
                  className="grid size-4 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {removed.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>外したタグ:</span>
          {removed.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => restore(t)}
              aria-label={`タグ「${t.name}」を戻す`}
              className="inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 hover:bg-muted hover:text-foreground"
            >
              <Plus className="size-3" aria-hidden />
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
