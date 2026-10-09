"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MousePointer2 } from "lucide-react";

// Waypoints as fractions of the canvas (x, y). Each peer loops through its path.
const peers = [
  { name: "佐藤", color: "#e11d48", path: [[0.18, 0.3], [0.42, 0.26], [0.36, 0.55], [0.18, 0.3]], dur: 7 },
  { name: "Mika", color: "#2563eb", path: [[0.7, 0.2], [0.82, 0.48], [0.6, 0.62], [0.7, 0.2]], dur: 8.5 },
  { name: "田中", color: "#059669", path: [[0.5, 0.78], [0.25, 0.72], [0.62, 0.4], [0.5, 0.78]], dur: 9.5 },
] as const;

const notes = [
  { x: "8%", y: "14%", text: "オンボーディングの離脱が多い", tone: "bg-amber-100 dark:bg-amber-900/50" },
  { x: "56%", y: "10%", text: "通知の頻度を見直す", tone: "bg-sky-100 dark:bg-sky-900/50" },
  { x: "30%", y: "58%", text: "検索結果に画像を出す", tone: "bg-emerald-100 dark:bg-emerald-900/50" },
];

export default function LiveCursor() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">ふりかえりボード</span>
        <div className="flex -space-x-1.5" aria-label={`${peers.length} 人が閲覧中`} role="img">
          {peers.map((p) => (
            <span
              key={p.name}
              className="grid size-6 place-items-center rounded-full text-[10px] font-medium text-white ring-2 ring-background"
              style={{ backgroundColor: p.color }}
            >
              {p.name[0]}
            </span>
          ))}
        </div>
      </div>
      <div
        ref={ref}
        className="relative h-56 overflow-hidden rounded-lg border bg-background bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
      >
        {notes.map((n) => (
          <div
            key={n.text}
            className={`absolute w-[38%] max-w-40 rounded-md p-2 text-xs text-foreground shadow-sm ${n.tone}`}
            style={{ left: n.x, top: n.y }}
          >
            {n.text}
          </div>
        ))}

        {size &&
          peers.map((p) => {
            const xs = p.path.map(([x]) => x * size.w);
            const ys = p.path.map(([, y]) => y * size.h);
            return (
              <motion.div
                key={p.name}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 will-change-transform"
                initial={{ x: xs[0], y: ys[0] }}
                animate={reduce ? { x: xs[0], y: ys[0] } : { x: xs, y: ys }}
                transition={reduce ? { duration: 0 } : { duration: p.dur, repeat: Infinity, ease: "easeInOut" }}
              >
                <MousePointer2 className="size-4 drop-shadow-sm" style={{ color: p.color, fill: p.color }} />
                <span
                  className="ml-3 inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name}
                </span>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
