"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, Move } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN = 1;
const MAX = 4;

type View = { s: number; x: number; y: number };

function clampView(v: View, w: number, h: number): View {
  const s = Math.min(MAX, Math.max(MIN, v.s));
  const maxX = ((s - 1) * w) / 2;
  const maxY = ((s - 1) * h) / 2;
  return { s, x: Math.min(maxX, Math.max(-maxX, v.x)), y: Math.min(maxY, Math.max(-maxY, v.y)) };
}

function MapArt() {
  return (
    <svg viewBox="0 0 400 260" className="size-full" aria-hidden>
      <rect width="400" height="260" className="fill-[#eef0e8] dark:fill-[#1d2420]" />
      <path d="M-10 190 C 80 160, 140 230, 230 200 S 360 150, 410 170 L410 210 C 350 195, 300 240, 230 235 S 90 200, -10 225 Z" className="fill-sky-200 dark:fill-sky-900/70" />
      <rect x="250" y="30" width="110" height="80" rx="8" className="fill-emerald-200 dark:fill-emerald-900/60" />
      {[[30, 30], [100, 30], [170, 30], [30, 95], [100, 95], [170, 95], [250, 125]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="55" height="50" rx="4" className="fill-white dark:fill-neutral-700" />
      ))}
      <g className="stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="6" fill="none">
        <path d="M0 88 H400" />
        <path d="M92 0 V260" />
        <path d="M240 0 V260" />
      </g>
      <g className="fill-neutral-500 dark:fill-neutral-400" fontSize="7" fontFamily="sans-serif">
        <text x="270" y="72">みどり公園</text>
        <text x="40" y="58">市役所</text>
        <text x="110" y="122">図書館</text>
        <text x="150" y="212">桜川</text>
        <text x="182" y="58">駅前ビル</text>
      </g>
      <g>
        <circle cx="128" cy="55" r="6" className="fill-rose-500" />
        <circle cx="128" cy="55" r="2.2" className="fill-white" />
        <text x="138" y="58" fontSize="5" fontFamily="sans-serif" className="fill-neutral-700 dark:fill-neutral-200">カフェ・ことり（2F）</text>
        <text x="138" y="64" fontSize="3" fontFamily="sans-serif" className="fill-neutral-500 dark:fill-neutral-400">営業 8:00–18:00 · 拡大すると読めます</text>
      </g>
    </svg>
  );
}

export default function ZoomPan() {
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number } | null>(null);

  const apply = (fn: (v: View) => View) => {
    const el = boxRef.current;
    const w = el?.clientWidth ?? 400;
    const h = el?.clientHeight ?? 260;
    setView((v) => clampView(fn(v), w, h));
  };

  const zoomAt = (factor: number, cx = 0, cy = 0) =>
    apply((v) => {
      const s = Math.min(MAX, Math.max(MIN, v.s * factor));
      const k = s / v.s;
      // keep the point under (cx, cy) — relative to centre — fixed
      return { s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2;
      const cy = e.clientY - r.top - r.height / 2;
      const factor = Math.exp(-e.deltaY * 0.002);
      setView((v) => {
        const s = Math.min(MAX, Math.max(MIN, v.s * factor));
        const k = s / v.s;
        return clampView({ s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k }, r.width, r.height);
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const nx = d.ox + e.clientX - d.sx;
    const ny = d.oy + e.clientY - d.sy;
    apply((v) => ({ ...v, x: nx, y: ny }));
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 30;
    const map: Record<string, () => void> = {
      ArrowLeft: () => apply((v) => ({ ...v, x: v.x + step })),
      ArrowRight: () => apply((v) => ({ ...v, x: v.x - step })),
      ArrowUp: () => apply((v) => ({ ...v, y: v.y + step })),
      ArrowDown: () => apply((v) => ({ ...v, y: v.y - step })),
      "+": () => zoomAt(1.25),
      "=": () => zoomAt(1.25),
      "-": () => zoomAt(0.8),
      "0": () => setView({ s: 1, x: 0, y: 0 }),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <div
        ref={boxRef}
        role="img"
        aria-label="市街地図。ドラッグで移動、ホイールまたは +/- キーで拡大縮小、矢印キーで移動"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          zoomAt(1.6, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
        }}
        className={`relative aspect-[400/260] touch-none select-none overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          view.s > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
        }`}
      >
        <div
          className="size-full will-change-transform"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
            transition: dragging ? "none" : "transform 150ms ease-out",
          }}
        >
          <MapArt />
        </div>
        {view.s === 1 && (
          <div className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <Move className="size-3" />
            ホイール・ダブルクリックで拡大
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-1">
        <Button size="icon-sm" variant="outline" aria-label="縮小" disabled={view.s <= MIN} onClick={() => zoomAt(0.8)}>
          <Minus />
        </Button>
        <span className="w-14 text-center text-xs tabular-nums text-muted-foreground" aria-live="polite">
          {Math.round(view.s * 100)}%
        </span>
        <Button size="icon-sm" variant="outline" aria-label="拡大" disabled={view.s >= MAX} onClick={() => zoomAt(1.25)}>
          <Plus />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="表示をリセット" className="ml-1" onClick={() => setView({ s: 1, x: 0, y: 0 })}>
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
