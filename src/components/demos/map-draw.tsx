"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Circle, Hexagon, Square, Trash2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = "polygon" | "circle" | "rect";
type Pt = { x: number; y: number };
type Shape =
  | { id: number; kind: "polygon"; pts: Pt[] }
  | { id: number; kind: "circle"; c: Pt; r: number }
  | { id: number; kind: "rect"; a: Pt; b: Pt };

type NewShape = Shape extends infer S ? (S extends Shape ? Omit<S, "id"> : never) : never;

const W = 400;
const H = 240;
/** 1 SVG unit = 10 m */
const toKm2 = (units2: number) => (units2 * 100) / 1e6;

const TOOLS: { v: Tool; label: string; icon: typeof Hexagon; hint: string }[] = [
  { v: "polygon", label: "多角形", icon: Hexagon, hint: "クリックで頂点を追加、始点をクリックかダブルクリックで確定" },
  { v: "circle", label: "円", icon: Circle, hint: "中心からドラッグして半径を決める" },
  { v: "rect", label: "矩形", icon: Square, hint: "対角線をドラッグする" },
];

function area(s: Shape) {
  if (s.kind === "circle") return Math.PI * s.r * s.r;
  if (s.kind === "rect") return Math.abs((s.b.x - s.a.x) * (s.b.y - s.a.y));
  let sum = 0;
  s.pts.forEach((p, i) => {
    const q = s.pts[(i + 1) % s.pts.length];
    sum += p.x * q.y - q.x * p.y;
  });
  return Math.abs(sum) / 2;
}

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const shapeCls = "fill-blue-500/20 stroke-blue-600 dark:fill-blue-400/25 dark:stroke-blue-400";

function ShapeEl({ s, active }: { s: Shape; active?: boolean }) {
  const common = { className: shapeCls, strokeWidth: active ? 2.5 : 1.5, vectorEffect: "non-scaling-stroke" as const };
  if (s.kind === "circle") return <circle cx={s.c.x} cy={s.c.y} r={s.r} {...common} />;
  if (s.kind === "rect")
    return (
      <rect
        x={Math.min(s.a.x, s.b.x)}
        y={Math.min(s.a.y, s.b.y)}
        width={Math.abs(s.b.x - s.a.x)}
        height={Math.abs(s.b.y - s.a.y)}
        {...common}
      />
    );
  return <polygon points={s.pts.map((p) => `${p.x},${p.y}`).join(" ")} {...common} />;
}

export default function MapDraw() {
  const [tool, setTool] = useState<Tool>("polygon");
  const [shapes, setShapes] = useState<Shape[]>([
    { id: 1, kind: "polygon", pts: [{ x: 60, y: 60 }, { x: 140, y: 40 }, { x: 170, y: 110 }, { x: 90, y: 130 }] },
  ]);
  const [poly, setPoly] = useState<Pt[]>([]);
  const [drag, setDrag] = useState<{ a: Pt; b: Pt } | null>(null);
  const [hover, setHover] = useState<Pt | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const nextId = useRef(2);

  const toPt = (e: { clientX: number; clientY: number }): Pt => {
    const r = svgRef.current!.getBoundingClientRect();
    return {
      x: Math.round(((e.clientX - r.left) / r.width) * W),
      y: Math.round(((e.clientY - r.top) / r.height) * H),
    };
  };

  const commit = (s: NewShape) => {
    const shape = { ...s, id: nextId.current++ } as Shape;
    setShapes((list) => [...list, shape]);
    setSelected(shape.id);
    setStatus(`${TOOLS.find((t) => t.v === shape.kind)!.label}を追加しました（約 ${toKm2(area(shape)).toFixed(2)} km²）`);
  };

  const finishPolygon = () => {
    if (poly.length >= 3) commit({ kind: "polygon", pts: poly });
    setPoly([]);
  };

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const p = toPt(e);
    if (tool === "polygon") {
      if (poly.length >= 3 && dist(p, poly[0]) < 12) finishPolygon();
      else if (poly.length > 0 && dist(p, poly[poly.length - 1]) < 4) return;
      else setPoly((pts) => [...pts, p]);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ a: p, b: p });
  };

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const p = toPt(e);
    if (drag) setDrag({ a: drag.a, b: p });
    else if (tool === "polygon") setHover(p);
  };

  const onUp = () => {
    if (!drag) return;
    if (dist(drag.a, drag.b) > 6) {
      if (tool === "circle") commit({ kind: "circle", c: drag.a, r: Math.round(dist(drag.a, drag.b)) });
      else commit({ kind: "rect", a: drag.a, b: drag.b });
    }
    setDrag(null);
  };

  const draft: Shape | null = drag
    ? tool === "circle"
      ? { id: 0, kind: "circle", c: drag.a, r: dist(drag.a, drag.b) }
      : { id: 0, kind: "rect", a: drag.a, b: drag.b }
    : null;

  const total = shapes.reduce((s, x) => s + area(x), 0);
  const current = TOOLS.find((t) => t.v === tool)!;

  return (
    <div className="mx-auto w-full max-w-xl space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="radiogroup" aria-label="描画ツール" className="inline-flex rounded-md border bg-card p-0.5">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const on = tool === t.v;
            return (
              <button
                key={t.v}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={t.label}
                title={t.label}
                tabIndex={on ? 0 : -1}
                onClick={() => {
                  setTool(t.v);
                  setPoly([]);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const i = TOOLS.findIndex((x) => x.v === tool);
                  const n = TOOLS[(i + (e.key === "ArrowRight" ? 1 : TOOLS.length - 1)) % TOOLS.length];
                  setTool(n.v);
                  setPoly([]);
                  (e.currentTarget.parentElement?.querySelectorAll("button")[TOOLS.indexOf(n)] as HTMLButtonElement | undefined)?.focus();
                }}
                className={cn(
                  "flex h-7 items-center gap-1 rounded px-2 text-xs transition-colors",
                  on ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" aria-hidden />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="最後の図形を取り消す"
            disabled={shapes.length === 0}
            onClick={() => setShapes((s) => s.slice(0, -1))}
            className="grid size-7 place-items-center rounded-md border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="すべて消去"
            disabled={shapes.length === 0}
            onClick={() => {
              setShapes([]);
              setPoly([]);
              setStatus("すべての範囲を消去しました");
            }}
            className="grid size-7 place-items-center rounded-md border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`地図。描画済みの範囲 ${shapes.length} 件`}
          tabIndex={0}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => setDrag(null)}
          onPointerLeave={() => setHover(null)}
          onDoubleClick={(e) => {
            e.preventDefault();
            finishPolygon();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") finishPolygon();
            if (e.key === "Escape") {
              setPoly([]);
              setDrag(null);
            }
          }}
          className="block aspect-[5/3] w-full cursor-crosshair touch-none select-none outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {/* base map */}
          <rect width={W} height={H} className="fill-stone-100 dark:fill-stone-900" />
          <path d="M250 0 C230 60 290 110 260 170 S280 230 300 240 L340 240 C320 210 330 160 300 110 S280 40 300 0Z" className="fill-sky-200 dark:fill-sky-900/60" />
          <rect x="300" y="30" width="80" height="60" rx="6" className="fill-emerald-200/80 dark:fill-emerald-900/50" />
          <rect x="30" y="170" width="110" height="50" rx="6" className="fill-emerald-200/80 dark:fill-emerald-900/50" />
          <g className="stroke-white dark:stroke-stone-700" strokeWidth="6" fill="none" strokeLinecap="round">
            <path d="M0 150 H400" />
            <path d="M200 0 V240" />
            <path d="M0 40 L180 100 L400 120" />
          </g>
          <g className="fill-stone-500 dark:fill-stone-400" fontSize="9" aria-hidden>
            <text x="310" y="64">中央公園</text>
            <text x="40" y="200">南緑地</text>
            <text x="268" y="200">川</text>
          </g>

          <g aria-hidden className="fill-stone-600 stroke-stone-600 dark:fill-stone-300 dark:stroke-stone-300">
            <path d="M12 226 V230 H62 V226" fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <text x="12" y="222" fontSize="9" stroke="none">500 m</text>
          </g>

          {shapes.map((s) => (
            <ShapeEl key={s.id} s={s} active={s.id === selected} />
          ))}
          {draft && <ShapeEl s={draft} active />}
          {poly.length > 0 && (
            <g>
              <polyline
                points={[...poly, ...(hover ? [hover] : [])].map((p) => `${p.x},${p.y}`).join(" ")}
                className="fill-blue-500/10 stroke-blue-600 dark:stroke-blue-400"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke"
              />
              {poly.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={i === 0 && poly.length >= 3 ? 5 : 3}
                  className="fill-white stroke-blue-600 dark:fill-stone-900 dark:stroke-blue-400"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
        <p className="text-muted-foreground">{poly.length > 0 ? `頂点 ${poly.length} 個 · Enter で確定 / Esc で取消` : current.hint}</p>
        <p className="tabular-nums">
          範囲 {shapes.length} 件 · 合計 約 <span className="font-medium">{toKm2(total).toFixed(2)}</span> km²
        </p>
      </div>
      <span aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  );
}
