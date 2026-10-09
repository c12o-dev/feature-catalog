"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** mulberry32 — deterministic PRNG so SSR and client agree. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function normal(r: () => number, mean: number, sd: number) {
  const u = Math.max(r(), 1e-9);
  const v = r();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
const clamp = (v: number) => Math.min(118, Math.max(2, v));

function sample(seed: number, gen: (r: () => number) => number, n = 160) {
  const r = rng(seed);
  return Array.from({ length: n }, () => clamp(gen(r))).sort((a, b) => a - b);
}

const RAW = [
  { label: "本社", note: "単峰", data: sample(7, (r) => normal(r, 42, 12)) },
  { label: "大阪", note: "右に裾", data: sample(11, (r) => 22 + Math.abs(normal(r, 0, 22))) },
  { label: "郊外", note: "二峰", data: sample(23, (r) => (r() < 0.5 ? normal(r, 28, 7) : normal(r, 78, 9))) },
];

function quantile(s: number[], p: number) {
  const i = (s.length - 1) * p;
  const lo = Math.floor(i);
  return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo);
}

function stats(s: number[]) {
  const q1 = quantile(s, 0.25);
  const q3 = quantile(s, 0.75);
  const iqr = q3 - q1;
  const lo = s.find((v) => v >= q1 - 1.5 * iqr)!;
  const hi = [...s].reverse().find((v) => v <= q3 + 1.5 * iqr)!;
  return { q1, med: quantile(s, 0.5), q3, lo, hi, out: s.filter((v) => v < lo || v > hi) };
}

function kde(s: number[], bw = 6) {
  const pts: [number, number][] = [];
  for (let y = 0; y <= 120; y += 2) {
    let d = 0;
    for (const v of s) d += Math.exp(-0.5 * ((y - v) / bw) ** 2);
    pts.push([y, d / (s.length * bw * Math.sqrt(2 * Math.PI))]);
  }
  return pts;
}

const SERIES = RAW.map((r) => ({ ...r, s: stats(r.data), k: kde(r.data) }));
const MAXD = Math.max(...SERIES.flatMap((x) => x.k.map((p) => p[1])));

type Mode = "box" | "violin" | "both";
const MODES: { v: Mode; label: string }[] = [
  { v: "box", label: "箱ひげ" },
  { v: "violin", label: "バイオリン" },
  { v: "both", label: "重ねる" },
];

const W = 320;
const H = 200;
const L = 34;
const T = 10;
const B = 28;
const r2 = (v: number) => Math.round(v * 100) / 100;
const y = (v: number) => r2(T + (H - T - B) * (1 - v / 120));
const fmt = (v: number) => Math.round(v);

export default function BoxPlot() {
  const [mode, setMode] = useState<Mode>("both");
  const [hover, setHover] = useState<number | null>(null);
  const colW = (W - L - 8) / SERIES.length;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + MODES.length) % MODES.length;
    setMode(MODES[n].v);
    (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
  };

  const info = hover !== null ? SERIES[hover] : null;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium">拠点別の通勤時間</div>
          <div className="text-xs text-muted-foreground">各 160 人・分</div>
        </div>
        <div role="radiogroup" aria-label="表示形式" className="inline-flex rounded-md border bg-muted/50 p-0.5">
          {MODES.map((m, i) => (
            <button
              key={m.v}
              type="button"
              role="radio"
              aria-checked={mode === m.v}
              tabIndex={mode === m.v ? 0 : -1}
              onClick={() => setMode(m.v)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors",
                mode === m.v && "bg-background text-foreground shadow-sm",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="group" aria-label="拠点別通勤時間の分布図">
        {[0, 30, 60, 90, 120].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - 4} y1={y(g)} y2={y(g)} stroke="currentColor" strokeOpacity={g === 0 ? 0.25 : 0.08} />
            <text x={L - 6} y={y(g)} dy="0.32em" textAnchor="end" fontSize="9" className="fill-muted-foreground tabular-nums">
              {g}
            </text>
          </g>
        ))}
        <text x={4} y={T + 2} fontSize="8" className="fill-muted-foreground" dominantBaseline="hanging">
          分
        </text>
        {SERIES.map((s, i) => {
          const cx = L + colW * (i + 0.5);
          const half = colW * 0.38;
          const showV = mode !== "box";
          const showB = mode !== "violin";
          const bw = mode === "both" ? 7 : 16;
          const path =
            s.k.map(([v, d], j) => `${j ? "L" : "M"}${r2(cx + (d / MAXD) * half)},${y(v)}`).join("") +
            [...s.k].reverse().map(([v, d]) => `L${r2(cx - (d / MAXD) * half)},${y(v)}`).join("") +
            "Z";
          const dim = hover !== null && hover !== i;
          return (
            <g
              key={s.label}
              tabIndex={0}
              role="button"
              aria-label={`${s.label}: 中央値 ${fmt(s.s.med)} 分、四分位 ${fmt(s.s.q1)}〜${fmt(s.s.q3)} 分`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="outline-none transition-opacity"
              opacity={dim ? 0.35 : 1}
            >
              <rect x={cx - colW / 2} y={T} width={colW} height={H - T - B} fill="transparent" />
              {showV && (
                <path
                  d={path}
                  className="fill-violet-500/25 stroke-violet-600 dark:fill-violet-400/25 dark:stroke-violet-400"
                  strokeWidth="1"
                />
              )}
              {showB && (
                <g className="stroke-foreground" strokeWidth="1">
                  <line x1={cx} x2={cx} y1={y(s.s.hi)} y2={y(s.s.q3)} />
                  <line x1={cx} x2={cx} y1={y(s.s.q1)} y2={y(s.s.lo)} />
                  <line x1={cx - bw / 2} x2={cx + bw / 2} y1={y(s.s.hi)} y2={y(s.s.hi)} />
                  <line x1={cx - bw / 2} x2={cx + bw / 2} y1={y(s.s.lo)} y2={y(s.s.lo)} />
                  <rect
                    x={cx - bw}
                    y={y(s.s.q3)}
                    width={bw * 2}
                    height={y(s.s.q1) - y(s.s.q3)}
                    className={mode === "both" ? "fill-background" : "fill-violet-500/25 dark:fill-violet-400/25"}
                    rx="1.5"
                  />
                  <line x1={cx - bw} x2={cx + bw} y1={y(s.s.med)} y2={y(s.s.med)} strokeWidth="2" />
                  {s.s.out.map((v, j) => (
                    <circle key={j} cx={cx} cy={y(v)} r="1.6" className="fill-none" />
                  ))}
                </g>
              )}
              <text x={cx} y={H - B + 14} textAnchor="middle" fontSize="10" className="fill-foreground">
                {s.label}
              </text>
              <text x={cx} y={H - B + 25} textAnchor="middle" fontSize="8" className="fill-muted-foreground">
                {s.note}
              </text>
            </g>
          );
        })}
      </svg>

      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground tabular-nums">
        {info
          ? `${info.label}: 中央値 ${fmt(info.s.med)} 分 / 四分位 ${fmt(info.s.q1)}〜${fmt(info.s.q3)} 分 / ひげ ${fmt(info.s.lo)}〜${fmt(info.s.hi)} 分`
          : "郊外は箱ひげだと普通に見えますが、バイオリンでは二つの山（近距離と遠距離）が分かります"}
      </p>
    </div>
  );
}
