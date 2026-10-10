"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const W = 400;
const H = 260;
const CELL = 10;
const GX = W / CELL + 1;
const GY = H / CELL + 1;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 飲食店の位置（駅前・商店街・川沿いの 3 クラスタ）
const POINTS = (() => {
  const r = mulberry32(42);
  const gauss = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
  const clusters = [
    { x: 130, y: 110, s: 28, n: 70 },
    { x: 270, y: 80, s: 22, n: 45 },
    { x: 300, y: 190, s: 34, n: 35 },
  ];
  const pts: { x: number; y: number }[] = [];
  for (const c of clusters) for (let i = 0; i < c.n; i++) pts.push({ x: c.x + gauss() * c.s, y: c.y + gauss() * c.s });
  for (let i = 0; i < 25; i++) pts.push({ x: r() * W, y: r() * H });
  return pts;
})();

function density(bw: number) {
  const g = new Float32Array(GX * GY);
  const inv = 1 / (2 * bw * bw);
  let max = 0;
  for (let j = 0; j < GY; j++)
    for (let i = 0; i < GX; i++) {
      const x = i * CELL;
      const y = j * CELL;
      let s = 0;
      for (const p of POINTS) {
        const dx = p.x - x;
        const dy = p.y - y;
        s += Math.exp(-(dx * dx + dy * dy) * inv);
      }
      g[j * GX + i] = s;
      if (s > max) max = s;
    }
  for (let k = 0; k < g.length; k++) g[k] /= max;
  return g;
}

// marching squares → 線分のパス
function contourPath(g: Float32Array, level: number) {
  let d = "";
  const v = (i: number, j: number) => g[j * GX + i];
  const lerp = (a: number, b: number) => (level - a) / (b - a || 1e-9);
  for (let j = 0; j < GY - 1; j++)
    for (let i = 0; i < GX - 1; i++) {
      const a = v(i, j), b = v(i + 1, j), c = v(i + 1, j + 1), e = v(i, j + 1);
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (e > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * CELL, y = j * CELL;
      const T = [x + lerp(a, b) * CELL, y] as const;
      const R = [x + CELL, y + lerp(b, c) * CELL] as const;
      const B = [x + lerp(e, c) * CELL, y + CELL] as const;
      const L = [x, y + lerp(a, e) * CELL] as const;
      const seg = (p: readonly number[], q: readonly number[]) => {
        d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
      };
      switch (idx) {
        case 1: case 14: seg(L, B); break;
        case 2: case 13: seg(B, R); break;
        case 3: case 12: seg(L, R); break;
        case 4: case 11: seg(T, R); break;
        case 6: case 9: seg(T, B); break;
        case 7: case 8: seg(L, T); break;
        case 5: seg(L, T); seg(B, R); break;
        case 10: seg(T, R); seg(L, B); break;
      }
    }
  return d;
}

const LEVELS = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];

export default function Contour() {
  const id = useId();
  const [bw, setBw] = useState(20);
  const [showHeat, setShowHeat] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showPoints, setShowPoints] = useState(false);

  const grid = useMemo(() => density(bw), [bw]);
  const paths = useMemo(() => LEVELS.map((l) => contourPath(grid, l)), [grid]);

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <div>
        <div className="text-sm font-medium">飲食店の密集度</div>
        <div className="text-xs text-muted-foreground">店舗 {POINTS.length} 件の位置からカーネル密度を推定</div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="地図上に飲食店の密度を等高線で重ねた図。駅前に最も密集している">
          {/* 地図 */}
          <rect width={W} height={H} className="fill-muted" />
          <path d="M0 150 C 80 140 120 200 200 190 S 330 230 400 220 L400 250 C 330 260 220 225 200 222 S 70 175 0 180 Z" className="fill-sky-200 dark:fill-sky-900/70" />
          <rect x="330" y="20" width="56" height="44" rx="6" className="fill-emerald-200 dark:fill-emerald-900/60" />
          <g className="stroke-background" strokeWidth="6" fill="none" strokeLinecap="round">
            <path d="M0 110 H400" />
            <path d="M200 0 V260" />
            <path d="M40 0 L120 260" />
            <path d="M260 0 Q 290 120 380 260" />
          </g>
          <g className="stroke-foreground/30" strokeWidth="2" strokeDasharray="10 6" fill="none">
            <path d="M0 60 L400 40" />
          </g>

          {/* ヒート */}
          {showHeat && (
            <g>
              {Array.from(grid).map((val, k) =>
                val < 0.08 ? null : (
                  <rect
                    key={k}
                    x={(k % GX) * CELL - CELL / 2}
                    y={Math.floor(k / GX) * CELL - CELL / 2}
                    width={CELL}
                    height={CELL}
                    className="fill-rose-500 dark:fill-rose-400"
                    opacity={val * 0.55}
                  />
                ),
              )}
            </g>
          )}

          {showLines &&
            paths.map((d, i) => (
              <path
                key={LEVELS[i]}
                d={d}
                fill="none"
                className="stroke-rose-700 dark:stroke-rose-200"
                strokeWidth={i === LEVELS.length - 1 ? 1.6 : 1}
                strokeOpacity={0.35 + i * 0.1}
              />
            ))}

          {showPoints &&
            POINTS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.6} className="fill-foreground/70" />)}

          <g fontSize="10" className="fill-foreground">
            <text x="206" y="104">中央駅</text>
            <text x="336" y="76">北公園</text>
            <text x="12" y="172" className="fill-sky-800 dark:fill-sky-200">緑川</text>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {[
          { label: "濃度", on: showHeat, set: setShowHeat },
          { label: "等高線", on: showLines, set: setShowLines },
          { label: "店舗", on: showPoints, set: setShowPoints },
        ].map((o) => (
          <label key={o.label} className="inline-flex cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={o.on} onChange={(e) => o.set(e.target.checked)} className="size-3.5 accent-primary" />
            {o.label}
          </label>
        ))}
        <div className="flex min-w-40 flex-1 items-center gap-2">
          <label htmlFor={id} className="shrink-0 text-muted-foreground">
            半径
          </label>
          <input
            id={id}
            type="range"
            min={10}
            max={40}
            value={bw}
            onChange={(e) => setBw(Number(e.target.value))}
            className="min-w-0 flex-1 accent-primary"
          />
          <span className={cn("w-8 text-right tabular-nums text-muted-foreground")}>{bw}</span>
        </div>
      </div>
    </div>
  );
}
