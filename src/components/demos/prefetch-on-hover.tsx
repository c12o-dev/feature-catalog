"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const pages = [
  { id: "pricing", title: "料金プラン", desc: "3 つのプランを比較" },
  { id: "changelog", title: "変更履歴", desc: "v4.2 のリリースノート" },
  { id: "docs", title: "導入ガイド", desc: "15 分でセットアップ" },
];

type Status = "idle" | "loading" | "ready";
const INTENT_MS = 120;
const FETCH_MS = 700;
const COLD_MS = 1400;

export default function PrefetchOnHover() {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [view, setView] = useState<{ id: string; loading: boolean; instant: boolean } | null>(null);
  const intent = useRef<number | undefined>(undefined);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      window.clearTimeout(intent.current);
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const prefetch = (id: string) => {
    if (status[id]) return;
    setStatus((s) => ({ ...s, [id]: "loading" }));
    timers.current.push(window.setTimeout(() => setStatus((s) => ({ ...s, [id]: "ready" })), FETCH_MS));
  };
  const startIntent = (id: string) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => prefetch(id), INTENT_MS);
  };
  const cancelIntent = () => window.clearTimeout(intent.current);

  const open = (id: string) => {
    cancelIntent();
    const ready = status[id] === "ready";
    setView({ id, loading: !ready, instant: ready });
    if (!ready) {
      timers.current.push(
        window.setTimeout(() => {
          setStatus((s) => ({ ...s, [id]: "ready" }));
          setView((v) => (v && v.id === id ? { ...v, loading: false } : v));
        }, COLD_MS),
      );
    }
  };

  const current = pages.find((p) => p.id === view?.id);

  return (
    <div className="relative mx-auto min-h-[260px] w-full max-w-md overflow-hidden rounded-lg border bg-background">
      {!view ? (
        <div className="p-3">
          <p className="mb-2 text-xs text-muted-foreground">リンクに hover / フォーカスすると裏で先読みします。先読み済みのページは一瞬で開きます。</p>
          <ul className="space-y-1.5">
            {pages.map((p) => {
              const st = status[p.id] ?? "idle";
              return (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    onMouseEnter={() => startIntent(p.id)}
                    onMouseLeave={cancelIntent}
                    onFocus={() => startIntent(p.id)}
                    onBlur={cancelIntent}
                    onTouchStart={() => prefetch(p.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      open(p.id);
                    }}
                    className="flex items-center gap-3 rounded-md border px-3 py-2.5 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{p.title}</span>
                      <span className="block text-xs text-muted-foreground">{p.desc}</span>
                    </span>
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1 text-xs",
                        st === "ready" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                      )}
                    >
                      {st === "loading" && <Loader2 className="size-3.5 motion-safe:animate-spin" aria-hidden />}
                      {st === "ready" && <Check className="size-3.5" aria-hidden />}
                      {st === "idle" ? "未取得" : st === "loading" ? "先読み中" : "先読み済"}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="p-3">
          <button type="button" onClick={() => setView(null)} className="mb-3 flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            一覧へ戻る
          </button>
          {view.loading ? (
            <div className="space-y-2" aria-busy="true">
              <div className="h-5 w-1/2 rounded bg-muted motion-safe:animate-pulse" />
              <div className="h-3 w-full rounded bg-muted motion-safe:animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-muted motion-safe:animate-pulse" />
              <p className="pt-1 text-xs text-muted-foreground">先読みされていないため読み込み中…</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-base font-semibold">{current?.title}</h3>
              <p className="text-sm text-muted-foreground">{current?.desc}。このページの内容が表示されています。</p>
              <p className={cn("flex items-center gap-1 text-xs", view.instant ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                {view.instant && <Zap className="size-3.5" aria-hidden />}
                {view.instant ? "先読み済みのため 0 ms で表示" : `表示まで ${COLD_MS.toLocaleString()} ms かかりました`}
              </p>
            </div>
          )}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {view ? (view.loading ? "読み込み中" : `${current?.title} を表示しました`) : ""}
      </p>
    </div>
  );
}
