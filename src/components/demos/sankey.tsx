"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type NodeDef = { id: string; label: string; col: number };
const NODES: NodeDef[] = [
  { id: "search", label: "検索", col: 0 },
  { id: "sns", label: "SNS", col: 0 },
  { id: "ads", label: "広告", col: 0 },
  { id: "view", label: "商品閲覧", col: 1 },
  { id: "bounce", label: "直帰", col: 1 },
  { id: "buy", label: "購入", col: 2 },
  { id: "cart", label: "カート放棄", col: 2 },
  { id: "exit", label: "離脱", col: 2 },
];
const LINKS: { s: string; t: string; v: number }[] = [
  { s: "search", t: "view", v: 900 },
  { s: "search", t: "bounce", v: 300 },
  { s: "sns", t: "view", v: 400 },
  { s: "sns", t: "bounce", v: 200 },
  { s: "ads", t: "view", v: 200 },
  { s: "ads", t: "bounce", v: 200 },
  { s: "view", t: "buy", v: 450 },
  { s: "view", t: "cart", v: 350 },
  { s: "view", t: "exit", v: 700 },
];

const W = 360;
const H = 230;
const NW = 10;
const GAP = 14;
const COL_X = [0, (W - NW) / 2, W - NW];

// Node value = max(inflow, outflow) so band widths always add up to node height (flow conservation).
const value = (id: string) =>
  Math.max(
    LINKS.filter((l) => l.t === id).reduce((a, l) => a + l.v, 0),
    LINKS.filter((l) => l.s === id).reduce((a, l) => a + l.v, 0),
  );
const colTotals = [0, 1, 2].map((c) => NODES.filter((n) => n.col === c).reduce((a, n) => a + value(n.id), 0));
const colCounts = [0, 1, 2].map((c) => NODES.filter((n) => n.col === c).length);
const K = Math.min(...colTotals.map((t, c) => (H - GAP * (colCounts[c] - 1)) / t));

const layout: Record<string, { x: number; y: number; h: number; v: number }> = {};
[0, 1, 2].forEach((c) => {
  let y = 0;
  NODES.filter((n) => n.col === c).forEach((n) => {
    const v = value(n.id);
    layout[n.id] = { x: COL_X[c], y, h: v * K, v };
    y += v * K + GAP;
  });
});
const order = (id: string) => NODES.findIndex((n) => n.id === id);
const outOff: Record<string, number> = {};
const inOff: Record<string, number> = {};
const BANDS = [...LINKS]
  .sort((a, b) => order(a.s) - order(b.s) || order(a.t) - order(b.t))
  .map((l) => {
    const so = outOff[l.s] ?? 0;
    outOff[l.s] = so + l.v * K;
    return { ...l, sy: layout[l.s].y + so };
  })
  .sort((a, b) => order(a.t) - order(b.t) || order(a.s) - order(b.s))
  .map((l) => {
    const to = inOff[l.t] ?? 0;
    inOff[l.t] = to + l.v * K;
    const th = l.v * K;
    const x0 = layout[l.s].x + NW;
    const x1 = layout[l.t].x;
    const xm = (x0 + x1) / 2;
    const ty = layout[l.t].y + to;
    const d = `M${x0},${l.sy} C${xm},${l.sy} ${xm},${ty} ${x1},${ty} L${x1},${ty + th} C${xm},${ty + th} ${xm},${l.sy + th} ${x0},${l.sy + th} Z`;
    return { ...l, d, key: `${l.s}-${l.t}` };
  });

const label = (id: string) => NODES.find((n) => n.id === id)!.label;
const fmt = (n: number) => n.toLocaleString("ja-JP");

export default function Sankey() {
  const [focus, setFocus] = useState<string | null>(null);
  const active = (b: { s: string; t: string; key: string }) => !focus || focus === b.key || focus === b.s || focus === b.t;
  const focusedBand = BANDS.find((b) => b.key === focus);
  const readout = focusedBand
    ? `${label(focusedBand.s)} → ${label(focusedBand.t)}: ${fmt(focusedBand.v)} 人`
    : focus
      ? `${label(focus)}: ${fmt(layout[focus].v)} 人`
      : "ノードや帯にカーソル（またはフォーカス）を当てると流量を表示";

  return (
    <figure className="mx-auto w-full max-w-xl space-y-3">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-medium">サイト訪問者の流れ（9 月）</span>
        <span className="text-xs text-muted-foreground tabular-nums">訪問 {fmt(colTotals[0])} 人</span>
      </figcaption>
      <svg viewBox={`-2 -4 ${W + 4} ${H + 8}`} className="h-auto w-full overflow-visible" role="group" aria-label="流入元から商品閲覧・直帰を経て購入・カート放棄・離脱に至る流れ">
        <g>
          {BANDS.map((b) => (
            <path
              key={b.key}
              d={b.d}
              tabIndex={0}
              role="img"
              aria-label={`${label(b.s)}から${label(b.t)}へ ${fmt(b.v)} 人`}
              onMouseEnter={() => setFocus(b.key)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(b.key)}
              onBlur={() => setFocus(null)}
              className={cn(
                "cursor-pointer outline-none transition-opacity",
                b.t === "buy" ? "fill-emerald-500/45 dark:fill-emerald-400/40" : "fill-primary/20",
                active(b) ? "opacity-100" : "opacity-25",
                focus === b.key && "opacity-100 [filter:brightness(1.1)]",
              )}
            />
          ))}
        </g>
        {NODES.map((n) => {
          const p = layout[n.id];
          const right = n.col === 2;
          return (
            <g
              key={n.id}
              tabIndex={0}
              role="img"
              aria-label={`${n.label} ${fmt(p.v)} 人`}
              onMouseEnter={() => setFocus(n.id)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(n.id)}
              onBlur={() => setFocus(null)}
              className="cursor-pointer outline-none"
            >
              <rect x={p.x} y={p.y} width={NW} height={p.h} rx={2} className={n.id === "buy" ? "fill-emerald-600 dark:fill-emerald-400" : "fill-foreground/80"} />
              <text
                x={right ? p.x - 6 : p.x + NW + 6}
                y={p.y + p.h / 2}
                dominantBaseline="middle"
                textAnchor={right ? "end" : "start"}
                fontSize={12}
                className="fill-foreground stroke-background [paint-order:stroke]"
                strokeWidth={3}
              >
                {n.label}
                <tspan className="fill-muted-foreground" dx={4}>
                  {fmt(p.v)}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <p aria-live="polite" className="min-h-5 text-xs text-muted-foreground tabular-nums">
        {readout}
      </p>
    </figure>
  );
}
