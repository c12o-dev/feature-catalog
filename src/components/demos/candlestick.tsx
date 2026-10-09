"use client";

import { useState } from "react";

const candles = [
  { d: "9/17", o: 100, c: 110, h: 115, l: 95 }, { d: "9/18", o: 110, c: 105, h: 112, l: 100 },
  { d: "9/19", o: 105, c: 120, h: 122, l: 103 }, { d: "9/22", o: 120, c: 118, h: 125, l: 115 },
  { d: "9/24", o: 118, c: 130, h: 132, l: 116 }, { d: "9/25", o: 130, c: 125, h: 134, l: 122 },
  { d: "9/26", o: 125, c: 140, h: 142, l: 124 }, { d: "9/29", o: 140, c: 138, h: 145, l: 135 },
  { d: "9/30", o: 138, c: 150, h: 152, l: 137 },
];

const W = 320, H = 190, L = 8, R = 36, T = 10, B = 24;
const lo = 90, hi = 160;
const ticks = [90, 100, 110, 120, 130, 140, 150, 160];
const y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
const step = (W - L - R) / candles.length;

export default function Candlestick() {
  const [sel, setSel] = useState(candles.length - 1);
  const c = candles[sel];
  const up = c.c >= c.o;
  const diff = c.c - c.o;
  return (
    <div className="mx-auto w-full max-w-xl space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs tabular-nums" aria-live="polite">
        <span className="font-medium">EXMP 日足</span>
        <span className="text-muted-foreground">{c.d}</span>
        <span>始 {c.o}</span><span>高 {c.h}</span><span>安 {c.l}</span><span>終 {c.c}</span>
        <span className={up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
          {diff >= 0 ? "+" : ""}{diff} ({((diff / c.o) * 100).toFixed(1)}%)
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="group" aria-label="ローソク足チャート 9/17〜9/30">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity="0.08" className="text-foreground" />
            <text x={W - R + 4} y={y(t) + 3} fontSize="9" className="fill-muted-foreground tabular-nums">{t}</text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="currentColor" strokeOpacity="0.25" className="text-foreground" />
        {candles.map((k, i) => {
          const x = L + step * i + step / 2;
          const rise = k.c >= k.o;
          const cls = rise ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
          return (
            <g
              key={k.d}
              tabIndex={0}
              role="button"
              aria-label={`${k.d} 始値 ${k.o} 高値 ${k.h} 安値 ${k.l} 終値 ${k.c}`}
              aria-pressed={sel === i}
              onMouseEnter={() => setSel(i)}
              onFocus={() => setSel(i)}
              onClick={() => setSel(i)}
              className={`cursor-crosshair outline-none ${cls}`}
            >
              <rect x={x - step / 2} y={T} width={step} height={H - T - B} className={sel === i ? "fill-foreground/5" : "fill-transparent"} />
              <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} stroke="currentColor" />
              <rect x={x - 6} y={y(Math.max(k.o, k.c))} width="12" height={Math.max(1, Math.abs(y(k.o) - y(k.c)))} fill="currentColor" fillOpacity={rise ? 0.9 : 1} />
              {(i % 2 === 0 || sel === i) && (
                <text x={x} y={H - B + 14} textAnchor="middle" fontSize="9" className={sel === i ? "fill-foreground" : "fill-muted-foreground"}>{k.d}</text>
              )}
            </g>
          );
        })}
        <line x1={L} x2={W - R} y1={y(c.c)} y2={y(c.c)} stroke="currentColor" strokeDasharray="2 3" strokeOpacity="0.4" className="pointer-events-none text-foreground" />
      </svg>
    </div>
  );
}
