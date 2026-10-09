"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const W = 400;
const H = 260;

const NODES = [
  { label: "佐藤", group: 0 },
  { label: "鈴木", group: 0 },
  { label: "高橋", group: 0 },
  { label: "田中", group: 0 },
  { label: "伊藤", group: 1 },
  { label: "渡辺", group: 1 },
  { label: "山本", group: 1 },
  { label: "中村", group: 2 },
  { label: "小林", group: 2 },
  { label: "加藤", group: 2 },
  { label: "吉田", group: 2 },
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 2], [2, 3],
  [0, 4], [4, 5], [4, 6], [5, 6],
  [3, 7], [7, 8], [7, 9], [8, 10], [9, 10], [6, 9],
];
const GROUP_CLASS = [
  "fill-primary",
  "fill-sky-500 dark:fill-sky-400",
  "fill-amber-500 dark:fill-amber-400",
];

type P = { x: number; y: number; vx: number; vy: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scatter(seed: number): P[] {
  const r = mulberry32(seed);
  return NODES.map(() => ({ x: 40 + r() * (W - 80), y: 30 + r() * (H - 60), vx: 0, vy: 0 }));
}

function step(ps: P[], alpha: number, pinned: number | null) {
  for (let i = 0; i < ps.length; i++) {
    for (let j = i + 1; j < ps.length; j++) {
      const dx = ps[j].x - ps[i].x;
      const dy = ps[j].y - ps[i].y;
      const d2 = Math.max(dx * dx + dy * dy, 25);
      const f = (1800 / d2) * alpha;
      const d = Math.sqrt(d2);
      ps[i].vx -= (dx / d) * f;
      ps[i].vy -= (dy / d) * f;
      ps[j].vx += (dx / d) * f;
      ps[j].vy += (dy / d) * f;
    }
  }
  for (const [a, b] of EDGES) {
    const dx = ps[b].x - ps[a].x;
    const dy = ps[b].y - ps[a].y;
    const d = Math.max(Math.hypot(dx, dy), 1);
    const f = (d - 55) * 0.05 * alpha;
    ps[a].vx += (dx / d) * f;
    ps[a].vy += (dy / d) * f;
    ps[b].vx -= (dx / d) * f;
    ps[b].vy -= (dy / d) * f;
  }
  ps.forEach((p, i) => {
    p.vx += (W / 2 - p.x) * 0.01 * alpha;
    p.vy += (H / 2 - p.y) * 0.01 * alpha;
    if (i === pinned) {
      p.vx = 0;
      p.vy = 0;
      return;
    }
    p.vx *= 0.6;
    p.vy *= 0.6;
    p.x = Math.min(W - 16, Math.max(16, p.x + p.vx));
    p.y = Math.min(H - 20, Math.max(16, p.y + p.vy));
  });
}

function settle(ps: P[]) {
  let a = 1;
  for (let i = 0; i < 300; i++) {
    step(ps, a, null);
    a *= 0.985;
  }
  return ps;
}

const INIT = scatter(7);
const clone = (ps: P[]) => ps.map((p) => ({ ...p }));

const neighbors = (i: number) =>
  EDGES.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));

export default function ForceGraph() {
  const reduce = useReducedMotion();
  const sim = useRef<P[]>(clone(INIT));
  const alpha = useRef(1);
  const drag = useRef<number | null>(null);
  const raf = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState<P[]>(() => clone(INIT));
  const [active, setActive] = useState<number | null>(null);
  const [seed, setSeed] = useState(7);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (reduce) {
      raf.current = requestAnimationFrame(() => {
        settle(sim.current);
        setPos(sim.current.map((p) => ({ ...p })));
      });
      return () => cancelAnimationFrame(raf.current);
    }
    const tick = () => {
      if (alpha.current > 0.02 || drag.current !== null) {
        step(sim.current, Math.max(alpha.current, drag.current !== null ? 0.3 : 0), drag.current);
        alpha.current *= 0.985;
        setPos(sim.current.map((p) => ({ ...p })));
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduce, seed]);

  const toLocal = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const onDown = (i: number) => (e: React.PointerEvent) => {
    if (reduce) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = i;
    setActive(i);
    alpha.current = Math.max(alpha.current, 0.5);
  };
  const onMove = (e: React.PointerEvent) => {
    if (drag.current === null) return;
    const { x, y } = toLocal(e);
    sim.current[drag.current].x = Math.min(W - 16, Math.max(16, x));
    sim.current[drag.current].y = Math.min(H - 20, Math.max(16, y));
  };
  const onUp = () => {
    drag.current = null;
    alpha.current = Math.max(alpha.current, 0.3);
  };

  const shuffle = () => {
    const s = seed + 1;
    sim.current = scatter(s);
    alpha.current = 1;
    setPos(sim.current.map((p) => ({ ...p })));
    setSeed(s);
  };

  const near = active === null ? [] : neighbors(active);
  const isLit = (i: number) => active === null || i === active || near.includes(i);

  return (
    <div className="mx-auto w-full max-w-xl space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium">チームのつながり</div>
          <div className="text-xs text-muted-foreground">ノードをドラッグすると力学的に再配置されます</div>
        </div>
        <Button size="sm" variant="outline" onClick={shuffle}>
          <Shuffle className="size-3.5" />
          再配置
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full touch-none select-none"
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="group"
          aria-label="メンバー関係グラフ"
        >
          {EDGES.map(([a, b], i) => {
            const lit = active !== null && (a === active || b === active);
            return (
              <line
                key={i}
                x1={pos[a].x}
                y1={pos[a].y}
                x2={pos[b].x}
                y2={pos[b].y}
                className={cn("stroke-foreground", lit ? "opacity-60" : active === null ? "opacity-20" : "opacity-[0.07]")}
                strokeWidth={lit ? 1.5 : 1}
              />
            );
          })}
          {pos.map((p, i) => (
            <g
              key={i}
              transform={`translate(${p.x} ${p.y})`}
              tabIndex={0}
              role="img"
              aria-label={`${NODES[i].label}さん。つながり: ${neighbors(i).map((n) => NODES[n].label).join("、")}`}
              className={cn("cursor-grab outline-none transition-opacity active:cursor-grabbing", isLit(i) ? "opacity-100" : "opacity-30")}
              onPointerDown={onDown(i)}
              onPointerEnter={() => drag.current === null && setActive(i)}
              onPointerLeave={() => drag.current === null && setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <circle r={14} className="fill-transparent" />
              <circle
                r={i === active ? 9 : 7}
                className={cn(GROUP_CLASS[NODES[i].group], "stroke-card")}
                strokeWidth={2}
              />
              <text y={20} textAnchor="middle" fontSize="10" className="pointer-events-none fill-foreground">
                {NODES[i].label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {["開発", "デザイン", "営業"].map((g, i) => (
          <span key={g} className="inline-flex items-center gap-1.5">
            <svg className="size-2.5" viewBox="0 0 10 10" aria-hidden>
              <circle cx="5" cy="5" r="5" className={GROUP_CLASS[i]} />
            </svg>
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}
