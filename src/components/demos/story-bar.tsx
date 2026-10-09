"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const users = [
  { name: "さくら", initial: "さ", tint: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300", story: "鎌倉で朝ごはん。しらす丼が最高でした", bg: "from-rose-200 to-amber-100 dark:from-rose-950 dark:to-amber-950" },
  { name: "けんた", initial: "け", tint: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300", story: "新しいキーボード届いた。打鍵感がいい", bg: "from-sky-200 to-indigo-100 dark:from-sky-950 dark:to-indigo-950" },
  { name: "みお", initial: "み", tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300", story: "ベランダのバジルが育ってきた", bg: "from-emerald-200 to-lime-100 dark:from-emerald-950 dark:to-lime-950" },
  { name: "たくみ", initial: "た", tint: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300", story: "10km 走った。自己ベスト更新", bg: "from-amber-200 to-orange-100 dark:from-amber-950 dark:to-orange-950" },
  { name: "あおい", initial: "あ", tint: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300", story: "週末は美術館へ。静かでよかった", bg: "from-violet-200 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950" },
  { name: "ゆうと", initial: "ゆ", tint: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200", story: "今日はカレーを仕込んだ", bg: "from-zinc-200 to-stone-100 dark:from-zinc-900 dark:to-stone-900" },
];

const DURATION = 4000;

export default function StoryBar() {
  const reduce = useReducedMotion();
  const [seen, setSeen] = useState<Set<number>>(() => new Set([2, 5]));
  const [current, setCurrent] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const show = (i: number) => {
    setCurrent(i);
    setSeen((s) => new Set(s).add(i));
  };
  const close = () => {
    const i = current;
    setCurrent(null);
    if (i !== null) requestAnimationFrame(() => triggerRefs.current[i]?.focus());
  };
  const next = () => {
    if (current === null) return;
    if (current < users.length - 1) show(current + 1);
    else close();
  };
  const prev = () => {
    if (current !== null && current > 0) show(current - 1);
  };

  // Auto-advance (disabled under reduced motion; use the arrows instead).
  useEffect(() => {
    if (current === null || reduce) return;
    const t = setTimeout(() => {
      if (current < users.length - 1) {
        setCurrent(current + 1);
        setSeen((s) => new Set(s).add(current + 1));
      } else setCurrent(null);
    }, DURATION);
    return () => clearTimeout(t);
  }, [current, reduce]);

  useEffect(() => {
    if (current !== null) closeRef.current?.focus();
  }, [current]);

  const u = current !== null ? users[current] : null;

  return (
    <div className="relative min-h-72 w-full">
      <div className="-mx-2 overflow-x-auto px-2 pb-1">
        <ul className="flex w-max gap-3" aria-label="ストーリー">
          {users.map((usr, i) => {
            const isSeen = seen.has(i);
            return (
              <li key={usr.name}>
                <button
                  ref={(el) => {
                    triggerRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => show(i)}
                  aria-label={`${usr.name}のストーリー${isSeen ? "（既読）" : "（未読）"}`}
                  className="group flex w-16 flex-col items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  <span className={cn("rounded-full p-[2px]", isSeen ? "bg-border" : "bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600")}>
                    <span className="block rounded-full bg-background p-[2px]">
                      <span className={cn("grid size-12 place-items-center rounded-full text-sm font-semibold transition-transform group-hover:scale-105", usr.tint)}>
                        {usr.initial}
                      </span>
                    </span>
                  </span>
                  <span className={cn("w-full truncate text-center text-xs", isSeen ? "text-muted-foreground" : "text-foreground")}>{usr.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">色付きの輪が未読。タップで開くと既読（灰色）になります。</p>

      {u && current !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${u.name}のストーリー`}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
          className={cn("absolute inset-0 z-10 flex flex-col overflow-hidden rounded-lg bg-gradient-to-br p-3", u.bg)}
        >
          <div className="flex gap-1" aria-hidden>
            {users.map((_, i) => (
              <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-foreground/20">
                <div
                  key={`${current}-${i}`}
                  className={cn(
                    "h-full origin-left bg-foreground/80",
                    i < current ? "scale-x-100" : i > current ? "scale-x-0" : reduce ? "scale-x-100" : "animate-[story-fill_linear_forwards]",
                  )}
                  style={i === current && !reduce ? { animationDuration: `${DURATION}ms` } : undefined}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn("grid size-7 place-items-center rounded-full text-xs font-semibold", u.tint)}>{u.initial}</span>
            <span className="text-sm font-medium">{u.name}</span>
            <span className="text-xs text-muted-foreground">2 時間前</span>
            <button ref={closeRef} type="button" onClick={close} aria-label="閉じる" className="ml-auto rounded-full p-1 hover:bg-foreground/10">
              <X className="size-4" />
            </button>
          </div>
          <p aria-live="polite" className="flex flex-1 items-center justify-center px-6 text-center text-base font-medium text-balance">
            {u.story}
          </p>
          <div className="flex items-center justify-between">
            <button type="button" onClick={prev} disabled={current === 0} aria-label="前のストーリー" className="rounded-full p-1.5 hover:bg-foreground/10 disabled:opacity-30">
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-xs text-muted-foreground tabular-nums">
              {current + 1} / {users.length}
            </span>
            <button type="button" onClick={next} aria-label="次のストーリー" className="rounded-full p-1.5 hover:bg-foreground/10">
              <ChevronRight className="size-5" />
            </button>
          </div>
          <style>{`@keyframes story-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
        </div>
      )}
    </div>
  );
}
