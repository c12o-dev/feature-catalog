"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Minus, Plus, RotateCcw } from "lucide-react";

type Pt = { id: number; x: number; y: number };

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 4 つの街に偏った 160 件の店舗ピン（seed 固定）
const TOWNS = [
  { x: 0.28, y: 0.34, n: 52, s: 0.07 },
  { x: 0.62, y: 0.52, n: 64, s: 0.09 },
  { x: 0.8, y: 0.24, n: 20, s: 0.05 },
  { x: 0.42, y: 0.76, n: 24, s: 0.06 },
];
const POINTS: Pt[] = (() => {
  const r = mulberry32(42);
  const pts: Pt[] = [];
  for (const t of TOWNS) {
    for (let i = 0; i < t.n; i++) {
      // Box–Muller で街の中心に寄せる
      const u = Math.max(1e-6, r());
      const v = r();
      const m = Math.sqrt(-2 * Math.log(u)) * t.s;
      pts.push({
        id: pts.length,
        x: Math.min(0.98, Math.max(0.02, t.x + m * Math.cos(2 * Math.PI * v))),
        y: Math.min(0.98, Math.max(0.02, t.y + m * Math.sin(2 * Math.PI * v))),
      });
    }
  }
  return pts;
})();

const ZOOMS = [1, 2, 4, 8];
const CELL = 0.14; // 画面比でこの距離内のピンを束ねる

type Cluster = { key: string; sx: number; sy: number; wx: number; wy: number; n: number };

function clamp(c: number, z: number) {
  const half = 0.5 / z;
  return Math.min(1 - half, Math.max(half, c));
}

export default function MarkerCluster() {
  const reduce = useReducedMotion();
  const [zi, setZi] = useState(0);
  const [center, setCenter] = useState({ x: 0.5, y: 0.5 });
  const z = ZOOMS[zi];

  const clusters = useMemo<Cluster[]>(() => {
    const cells = new Map<string, { sx: number; sy: number; n: number }>();
    for (const p of POINTS) {
      const sx = (p.x - center.x) * z + 0.5;
      const sy = (p.y - center.y) * z + 0.5;
      if (sx < -0.02 || sx > 1.02 || sy < -0.02 || sy > 1.02) continue;
      // ワールド座標でグリッドを切ると、パンしても束ね方がぶれない
      const key = `${Math.floor((p.x * z) / CELL)}:${Math.floor((p.y * z) / CELL)}`;
      const c = cells.get(key) ?? { sx: 0, sy: 0, n: 0 };
      c.sx += sx;
      c.sy += sy;
      c.n += 1;
      cells.set(key, c);
    }
    return [...cells.entries()].map(([key, c]) => {
      const sx = c.sx / c.n;
      const sy = c.sy / c.n;
      return { key: `${z}-${key}`, sx, sy, n: c.n, wx: (sx - 0.5) / z + center.x, wy: (sy - 0.5) / z + center.y };
    });
  }, [z, center]);

  const zoomTo = (nextZi: number, cx = center.x, cy = center.y) => {
    const nz = ZOOMS[nextZi];
    setZi(nextZi);
    setCenter({ x: clamp(cx, nz), y: clamp(cy, nz) });
  };

  const visible = clusters.reduce((s, c) => s + c.n, 0);
  const tx = (0.5 - center.x * z) * 100;
  const ty = (0.5 - center.y * z) * 100;

  return (
    <div className="mx-auto w-full max-w-xl space-y-2">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-[#e8efe6] dark:bg-[#1b2420] sm:aspect-video">
        {/* 地図レイヤー（ズームで拡大） */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full origin-top-left transition-transform duration-500 ease-out"
          style={{ transform: `translate(${tx}%, ${ty}%) scale(${z})` }}
        >
          <path d="M0 62 C18 58 30 70 48 66 S80 54 100 60 L100 72 C82 66 66 78 48 78 S16 70 0 74Z" className="fill-sky-200 dark:fill-sky-900/60" />
          <rect x="8" y="10" width="14" height="10" rx="2" className="fill-emerald-200 dark:fill-emerald-900/50" />
          <rect x="70" y="80" width="18" height="12" rx="2" className="fill-emerald-200 dark:fill-emerald-900/50" />
          <g className="stroke-white dark:stroke-white/15" strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke">
            <path d="M0 30 L100 38" vectorEffect="non-scaling-stroke" />
            <path d="M0 50 C30 46 60 54 100 48" vectorEffect="non-scaling-stroke" />
            <path d="M35 0 L40 100" vectorEffect="non-scaling-stroke" />
            <path d="M70 0 C66 30 72 60 64 100" vectorEffect="non-scaling-stroke" />
            <path d="M10 0 L22 100" vectorEffect="non-scaling-stroke" />
            <path d="M88 0 L92 100" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        {/* マーカー / クラスタ */}
        {clusters.map((c) => {
          const single = c.n === 1;
          const size = single ? 12 : Math.round(22 + Math.log2(c.n) * 5);
          return (
            <motion.button
              key={c.key}
              type="button"
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              aria-label={single ? "店舗ピン" : `${c.n} 件のピン。押すとズーム`}
              disabled={single && zi === ZOOMS.length - 1}
              onClick={() => (zi < ZOOMS.length - 1 ? zoomTo(zi + 1, c.wx, c.wy) : undefined)}
              className={
                single
                  ? "absolute -ml-1.5 -mt-1.5 rounded-full border-2 border-white bg-rose-500 shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default dark:border-zinc-900 dark:bg-rose-400"
                  : "absolute grid place-items-center rounded-full bg-rose-500/90 text-xs font-semibold tabular-nums text-white shadow ring-4 ring-rose-500/25 hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-rose-400/90 dark:text-zinc-950 dark:ring-rose-400/25"
              }
              style={{
                left: `${c.sx * 100}%`,
                top: `${c.sy * 100}%`,
                width: size,
                height: size,
                ...(single ? {} : { marginLeft: -size / 2, marginTop: -size / 2 }),
              }}
            >
              {single ? null : c.n}
            </motion.button>
          );
        })}

        {/* ズーム操作 */}
        <div className="absolute right-2 top-2 flex flex-col overflow-hidden rounded-md border bg-background shadow-sm">
          <button
            type="button"
            aria-label="ズームイン"
            disabled={zi === ZOOMS.length - 1}
            onClick={() => zoomTo(zi + 1)}
            className="grid size-8 place-items-center hover:bg-muted disabled:opacity-40"
          >
            <Plus aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="ズームアウト"
            disabled={zi === 0}
            onClick={() => zoomTo(zi - 1)}
            className="grid size-8 place-items-center border-t hover:bg-muted disabled:opacity-40"
          >
            <Minus aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="全体表示に戻す"
            disabled={zi === 0}
            onClick={() => zoomTo(0, 0.5, 0.5)}
            className="grid size-8 place-items-center border-t hover:bg-muted disabled:opacity-40"
          >
            <RotateCcw aria-hidden className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span aria-live="polite" className="tabular-nums">
          ズーム ×{z} · {clusters.length} 個に集約 / 表示中 {visible} 件
        </span>
        <span>クラスタを押すと展開</span>
      </div>
    </div>
  );
}
