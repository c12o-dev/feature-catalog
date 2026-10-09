"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PALETTE = [
  { sky: "#9cc3e6", far: "#6f8fb0", near: "#3f5e7a", sun: "#fdf1cf", ph: "#7e9fbf" },
  { sky: "#f4c7a1", far: "#c98b6b", near: "#7d4e3e", sun: "#fff3dc", ph: "#c99a82" },
  { sky: "#b9dcc6", far: "#7fa98d", near: "#3e6a4f", sun: "#f3f9e4", ph: "#86ad95" },
  { sky: "#d8c6ec", far: "#9a86b8", near: "#584a78", sun: "#fbf3ff", ph: "#a291c0" },
  { sky: "#f2dca2", far: "#c3a35c", near: "#6e5a2e", sun: "#fffbe8", ph: "#c4ac72" },
  { sky: "#a9d6dc", far: "#5f9ea6", near: "#2f5e64", sun: "#f0fbfc", ph: "#6fa7ae" },
];

const TITLES = ["朝の湖", "夕焼けの丘", "森の小道", "紫の谷", "麦畑", "入り江", "雪解け", "砂丘", "棚田", "高原", "渓谷", "岬"];

function photo(i: number) {
  const p = PALETTE[i % PALETTE.length];
  const a = 40 + ((i * 37) % 50);
  const b = 60 + ((i * 53) % 40);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="${p.sky}"/><circle cx="${110 - (i % 4) * 18}" cy="28" r="10" fill="${p.sun}"/><path d="M0 ${a} L40 ${a - 18} L80 ${a - 4} L120 ${a - 22} L160 ${a - 8} V90 H0Z" fill="${p.far}"/><path d="M0 ${b} L50 ${b - 12} L100 ${b + 2} L160 ${b - 10} V90 H0Z" fill="${p.near}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const N = 12;

export default function LazyImage() {
  const root = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<Record<number, string>>({});
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          obs.unobserve(e.target);
          // Simulated network latency before the request resolves
          const t = setTimeout(() => {
            timers.delete(t);
            setSrc((s) => ({ ...s, [i]: photo(i) }));
          }, 350 + (i % 3) * 250);
          timers.add(t);
        }
      },
      { root: el, rootMargin: "0px 0px -20px 0px" },
    );
    el.querySelectorAll("[data-index]").forEach((n) => obs.observe(n));
    return () => {
      obs.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const count = Object.keys(loaded).length;

  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>スクロールすると画面に入った画像だけ読み込みます</span>
        <span aria-live="polite" className="shrink-0 tabular-nums">
          {count} / {N} 枚
        </span>
      </div>
      <div ref={root} tabIndex={0} aria-label="写真ギャラリー（スクロール可能）" className="h-64 overflow-y-auto rounded-lg border bg-card p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: N }, (_, i) => {
            const p = PALETTE[i % PALETTE.length];
            const isLoaded = loaded[i];
            return (
              <figure key={i} data-index={i} className="relative aspect-video overflow-hidden rounded-md" style={{ backgroundColor: p.ph }}>
                {src[i] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src[i]}
                    alt={TITLES[i]}
                    width={160}
                    height={90}
                    decoding="async"
                    onLoad={() => setLoaded((l) => ({ ...l, [i]: true }))}
                    className={cn("size-full object-cover transition-opacity duration-500", isLoaded ? "opacity-100" : "opacity-0")}
                  />
                )}
                {!isLoaded && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="size-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" aria-hidden />
                  </span>
                )}
                <figcaption className="absolute right-1 bottom-1 rounded bg-black/45 px-1 text-[10px] text-white">{TITLES[i]}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
