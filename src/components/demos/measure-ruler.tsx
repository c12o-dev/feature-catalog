"use client";

import { useRef, useState } from "react";
import { Undo2, Trash2 } from "lucide-react";

type Pt = { x: number; y: number };

const W = 320;
const H = 200;
const METERS_PER_UNIT = 5; // 1 viewBox 単位 = 5 m

function fmt(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

export default function MeasureRuler() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pts, setPts] = useState<Pt[]>([
    { x: 60, y: 150 },
    { x: 150, y: 70 },
  ]);
  const [cursor, setCursor] = useState<Pt>({ x: 160, y: 100 });

  const segs = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y) * METERS_PER_UNIT);
  const total = segs.reduce((a, b) => a + b, 0);

  const add = (p: Pt) => setPts((ps) => [...ps, p]);

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const p = { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    setCursor(p);
    add(p);
  };

  const onKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    const step = e.shiftKey ? 20 : 5;
    const d: Record<string, Pt> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    if (d[e.key]) {
      e.preventDefault();
      setCursor((c) => ({
        x: Math.min(W, Math.max(0, c.x + d[e.key].x)),
        y: Math.min(H, Math.max(0, c.y + d[e.key].y)),
      }));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      add(cursor);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setPts((ps) => ps.slice(0, -1));
    }
  };

  const last = pts[pts.length - 1];

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg border bg-emerald-50 dark:bg-emerald-950/30">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full cursor-crosshair touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-ring"
          role="application"
          aria-label="地図。クリックで計測点を追加。キーボードでは矢印で照準を動かし Enter で追加、Backspace で 1 つ戻す"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={onKey}
        >
          {/* 簡易地図 */}
          <path d="M0 120 C 80 100, 140 140, 320 110" className="stroke-sky-300 dark:stroke-sky-800" strokeWidth="14" fill="none" />
          <path d="M40 0 L 90 200 M 0 50 L 320 70 M 210 0 L 250 200" className="stroke-background" strokeWidth="6" fill="none" />
          <rect x="230" y="120" width="60" height="45" rx="4" className="fill-emerald-200 dark:fill-emerald-900" />
          <rect x="110" y="10" width="60" height="35" rx="4" className="fill-muted" />

          {pts.length > 1 && (
            <polyline
              points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              className="stroke-rose-500 dark:stroke-rose-400"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeLinejoin="round"
            />
          )}
          {pts.slice(1).map((p, i) => {
            const a = pts[i];
            return (
              <text
                key={`l${i}`}
                x={(a.x + p.x) / 2}
                y={(a.y + p.y) / 2 - 6}
                fontSize="10"
                textAnchor="middle"
                className="fill-foreground"
                style={{ paintOrder: "stroke", stroke: "var(--background)", strokeWidth: 3 }}
              >
                {fmt(segs[i])}
              </text>
            );
          })}
          {pts.map((p, i) => (
            <circle
              key={`p${i}`}
              cx={p.x}
              cy={p.y}
              r="4.5"
              className="fill-background stroke-rose-500 dark:stroke-rose-400"
              strokeWidth="2.5"
            />
          ))}
          {last && (
            <line x1={last.x} y1={last.y} x2={cursor.x} y2={cursor.y} className="stroke-rose-500/40" strokeWidth="1.5" strokeDasharray="2 3" />
          )}
          <g className="stroke-foreground/60" strokeWidth="1.5">
            <line x1={cursor.x - 6} y1={cursor.y} x2={cursor.x + 6} y2={cursor.y} />
            <line x1={cursor.x} y1={cursor.y - 6} x2={cursor.x} y2={cursor.y + 6} />
          </g>
          {/* 縮尺 */}
          <g transform={`translate(${W - 70} ${H - 14})`}>
            <line x1="0" y1="0" x2="40" y2="0" className="stroke-foreground" strokeWidth="2" />
            <text x="46" y="3.5" fontSize="9" className="fill-foreground">200 m</text>
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm" aria-live="polite">
          <span className="text-muted-foreground">合計距離 </span>
          <span className="font-semibold tabular-nums">{fmt(total)}</span>
          <span className="ml-2 text-xs text-muted-foreground tabular-nums">{pts.length} 点</span>
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPts((ps) => ps.slice(0, -1))}
            disabled={pts.length === 0}
            className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
          >
            <Undo2 className="size-3.5" aria-hidden />
            戻す
          </button>
          <button
            type="button"
            onClick={() => setPts([])}
            disabled={pts.length === 0}
            className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
          >
            <Trash2 className="size-3.5" aria-hidden />
            クリア
          </button>
        </div>
      </div>
    </div>
  );
}
