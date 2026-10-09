"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const layers = [
  { speed: 0.15, d: "M0 120 L60 70 L110 100 L170 50 L240 95 L300 60 L360 90 L400 70 L400 200 L0 200 Z", cls: "fill-indigo-300/70 dark:fill-indigo-900/80" },
  { speed: 0.35, d: "M0 140 L50 110 L120 135 L190 95 L260 130 L330 105 L400 125 L400 200 L0 200 Z", cls: "fill-indigo-400/80 dark:fill-indigo-800/90" },
  { speed: 0.6, d: "M0 165 L80 140 L150 160 L230 135 L310 158 L400 145 L400 200 L0 200 Z", cls: "fill-indigo-600 dark:fill-indigo-700" },
];

export default function Parallax() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const offset = (speed: number) => (reduce ? 0 : y * speed);

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        onScroll={(e) => setY(e.currentTarget.scrollTop)}
        tabIndex={0}
        aria-label="視差スクロールの例（スクロールできます）"
        className="relative h-56 overflow-y-auto rounded-lg border outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-b from-sky-200 to-indigo-100 dark:from-slate-900 dark:to-indigo-950">
          <div
            aria-hidden
            className="absolute right-8 top-6 size-10 rounded-full bg-amber-200 dark:bg-slate-200"
            style={{ transform: `translateY(${offset(0.8)}px)` }}
          />
          {layers.map((l, i) => (
            <svg
              key={i}
              aria-hidden
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
              className="absolute inset-x-0 bottom-0 h-full w-full"
              style={{ transform: `translateY(${offset(l.speed)}px)` }}
            >
              <path d={l.d} className={l.cls} />
            </svg>
          ))}
          <div className="absolute inset-x-0 top-1/3 text-center" style={{ transform: `translateY(${offset(0.5)}px)` }}>
            <div className="text-lg font-semibold text-indigo-950 dark:text-indigo-50">山あいの朝</div>
            <div className="text-xs text-indigo-900/70 dark:text-indigo-100/70">下へスクロール</div>
          </div>
        </div>
        <div className="relative space-y-2 bg-background p-4 text-sm">
          <p className="font-medium">奥の層ほどゆっくり動く</p>
          <p className="text-muted-foreground">太陽・遠い山・近い山がそれぞれ違う速度で移動し、平面に奥行きが生まれます。</p>
          <p className="text-muted-foreground">「視差効果を減らす」設定では層を固定し、通常のスクロールだけにしています。</p>
          <div className="h-16" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {reduce ? "視差効果を減らす設定のため、層の移動を止めています" : "スクロール量 × 層ごとの係数で translateY"}
      </p>
    </div>
  );
}
