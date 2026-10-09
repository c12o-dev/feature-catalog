"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const NODES = ["営業", "開発", "デザイン", "サポート", "マーケ", "経理"];
// weekly messages between departments
const LINKS: [number, number, number][] = [
  [0, 1, 18],
  [0, 3, 32],
  [0, 4, 26],
  [0, 5, 12],
  [1, 2, 40],
  [1, 3, 22],
  [2, 4, 28],
  [3, 4, 10],
  [4, 5, 8],
  [1, 5, 6],
];

const C = 120;
const R = 92;
const GAP = 8; // degrees between segments
const SEG = 360 / NODES.length;

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const pt = (deg: number, r = R) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const;
const f = (n: number) => n.toFixed(1);

function arcPath(start: number, end: number, r0: number, r1: number) {
  const [a, b] = pt(start, r1);
  const [c, d] = pt(end, r1);
  const [e, g] = pt(end, r0);
  const [h, i] = pt(start, r0);
  return `M${f(a)} ${f(b)} A${r1} ${r1} 0 0 1 ${f(c)} ${f(d)} L${f(e)} ${f(g)} A${r0} ${r0} 0 0 0 ${f(h)} ${f(i)} Z`;
}

// place each link's endpoint inside its node's segment, spread evenly
const endpoints = (() => {
  const perNode: number[][] = NODES.map(() => []);
  LINKS.forEach(([a, b], li) => {
    perNode[a].push(li);
    perNode[b].push(li);
  });
  const angle = new Map<string, number>();
  perNode.forEach((list, n) => {
    const start = n * SEG + GAP / 2;
    const span = SEG - GAP;
    list.forEach((li, k) => angle.set(`${li}-${n}`, start + (span * (k + 1)) / (list.length + 1)));
  });
  return angle;
})();

const maxV = Math.max(...LINKS.map((l) => l[2]));

export default function ChordDiagram() {
  const [active, setActive] = useState<number | null>(1);

  const connected = active === null ? [] : LINKS.filter(([a, b]) => a === active || b === active);
  const total = connected.reduce((s, l) => s + l[2], 0);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 sm:flex-row sm:items-start">
      <svg viewBox="0 0 240 240" className="w-full max-w-[260px] shrink-0" role="img" aria-label="部署間のメッセージ量を示すコード図">
        {LINKS.map(([a, b, v], li) => {
          const [x1, y1] = pt(endpoints.get(`${li}-${a}`)!, R - 10);
          const [x2, y2] = pt(endpoints.get(`${li}-${b}`)!, R - 10);
          const on = active === null || a === active || b === active;
          return (
            <path
              key={li}
              d={`M${f(x1)} ${f(y1)} Q${C} ${C} ${f(x2)} ${f(y2)}`}
              fill="none"
              strokeLinecap="round"
              strokeWidth={1.5 + (v / maxV) * 6}
              className={cn(
                "transition-opacity duration-200",
                on && active !== null ? "stroke-sky-500 dark:stroke-sky-400" : "stroke-foreground",
              )}
              strokeOpacity={on ? (active === null ? 0.25 : 0.7) : 0.06}
            />
          );
        })}
        {NODES.map((name, n) => {
          const start = n * SEG + GAP / 2;
          const end = (n + 1) * SEG - GAP / 2;
          const [lx, ly] = pt((start + end) / 2, R + 16);
          const isActive = active === n;
          return (
            <g key={name}>
              <path
                d={arcPath(start, end, R - 8, R)}
                className={cn(isActive ? "fill-sky-500 dark:fill-sky-400" : "fill-foreground/70")}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn("text-[10px]", isActive ? "fill-foreground font-semibold" : "fill-muted-foreground")}
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="w-full min-w-0 space-y-3">
        <div role="group" aria-label="部署を選択" className="flex flex-wrap gap-1.5">
          {NODES.map((name, n) => (
            <button
              key={name}
              type="button"
              aria-pressed={active === n}
              onClick={() => setActive(active === n ? null : n)}
              onMouseEnter={() => setActive(n)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition-colors",
                active === n ? "border-sky-500 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-100" : "hover:bg-muted",
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="rounded-lg border p-3">
          {active === null ? (
            <p className="text-sm text-muted-foreground">部署を選ぶと、やり取りのある相手と量を表示します。</p>
          ) : (
            <>
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span className="font-medium">{NODES[active]}</span>
                <span className="text-xs text-muted-foreground tabular-nums">週 {total} 件</span>
              </div>
              <ul className="space-y-1.5">
                {connected
                  .slice()
                  .sort((x, y) => y[2] - x[2])
                  .map(([a, b, v]) => {
                    const other = a === active ? b : a;
                    return (
                      <li key={`${a}-${b}`} className="flex items-center gap-2 text-xs">
                        <span className="w-14 shrink-0 text-muted-foreground">{NODES[other]}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <span className="block h-full rounded-full bg-sky-500 dark:bg-sky-400" style={{ width: `${(v / maxV) * 100}%` }} />
                        </span>
                        <span className="w-8 text-right tabular-nums">{v}</span>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
