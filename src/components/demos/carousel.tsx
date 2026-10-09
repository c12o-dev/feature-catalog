"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { title: "秋の新作コレクション", sub: "10/1 公開", bg: "bg-gradient-to-br from-stone-200 to-amber-100 dark:from-stone-800 dark:to-amber-950" },
  { title: "週末限定 送料無料", sub: "10/4 – 10/6", bg: "bg-gradient-to-br from-slate-200 to-sky-100 dark:from-slate-800 dark:to-sky-950" },
  { title: "会員ランク特典", sub: "ゴールド以上", bg: "bg-gradient-to-br from-zinc-200 to-emerald-100 dark:from-zinc-800 dark:to-emerald-950" },
  { title: "ギフト包装はじめました", sub: "全商品対応", bg: "bg-gradient-to-br from-neutral-200 to-rose-100 dark:from-neutral-800 dark:to-rose-950" },
];

export default function Carousel() {
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const go = (n: number) => {
    const el = track.current;
    if (!el) return;
    const j = (n + slides.length) % slides.length;
    el.scrollTo({ left: j * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };
  const onScroll = () => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    const j = Math.round(el.scrollLeft / el.clientWidth);
    if (j !== i) setI(j);
  };

  return (
    <div className="w-full space-y-3" role="region" aria-roledescription="カルーセル" aria-label="キャンペーン">
      <div className="relative">
        <div
          ref={track}
          onScroll={onScroll}
          tabIndex={0}
          aria-label="スライド（横スクロール・スワイプで切替）"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
          }}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-lg border [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s, j) => (
            <div
              key={s.title}
              role="group"
              aria-roledescription="スライド"
              aria-label={`${j + 1} / ${slides.length}`}
              className={`flex aspect-[16/9] w-full shrink-0 snap-start snap-always flex-col justify-end p-4 ${s.bg}`}
            >
              <span className="text-xs text-muted-foreground">{s.sub}</span>
              <span className="text-base font-semibold sm:text-xl">{s.title}</span>
            </div>
          ))}
        </div>
        <button
          aria-label="前のスライド"
          onClick={() => go(i - 1)}
          className="absolute left-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border bg-background/80 shadow-sm backdrop-blur hover:bg-background"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          aria-label="次のスライド"
          onClick={() => go(i + 1)}
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border bg-background/80 shadow-sm backdrop-blur hover:bg-background"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">{i + 1} / {slides.length}</span>
        <div className="flex gap-1.5">
          {slides.map((s, j) => (
            <button
              key={s.title}
              aria-label={`スライド ${j + 1} へ`}
              aria-current={i === j ? "true" : undefined}
              onClick={() => go(j)}
              className="grid h-6 place-items-center px-0.5"
            >
              <span className={`block h-1.5 rounded-full transition-all ${i === j ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">スワイプ可</span>
      </div>
    </div>
  );
}
