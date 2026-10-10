"use client";

import { useId } from "react";

const data = Array.from({ length: 24 }, (_, i) => ({
  i,
  v: 50 + 30 * Math.sin(i / 3) + (i * 1.5),
}));

// Plain inline SVG instead of a measured chart: with a viewBox and preserveAspectRatio="none" the
// path stretches to whatever box the flex parent gives it, so there is no 0-width first measurement
// (which used to leave a ~10px fragment next to the number on wide cards).
const VW = 100;
const VH = 40;
const values = data.map((d) => d.v);
const min = Math.min(...values);
const max = Math.max(...values);
const points = data.map((d, i) => [
  (i / (data.length - 1)) * VW,
  VH - ((d.v - min) / (max - min || 1)) * (VH - 2) - 1,
] as const);
const LINE = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
const AREA = `${LINE} L${VW},${VH} L0,${VH} Z`;
const COLOR = "hsl(142 71% 45%)";

export default function Sparkline() {
  const gradientId = useId();
  const last = data[data.length - 1].v;
  const prev = data[0].v;
  const delta = ((last - prev) / prev) * 100;

  return (
    <div className="flex w-full items-center gap-6">
      <div className="shrink-0 space-y-1">
        <div className="text-xs text-muted-foreground">MRR</div>
        <div className="text-2xl font-semibold tabular-nums">¥{Math.round(last * 100).toLocaleString()}</div>
        <div className="text-xs text-emerald-700 dark:text-emerald-400">+{delta.toFixed(1)}%</div>
      </div>
      <div className="h-12 min-w-0 flex-1">
        <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" className="block h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR} stopOpacity={0.6} />
              <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={AREA} fill={`url(#${gradientId})`} />
          <path d={LINE} fill="none" stroke={COLOR} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
