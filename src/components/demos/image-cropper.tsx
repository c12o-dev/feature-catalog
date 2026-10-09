"use client";

import { useRef, useState } from "react";
import { Check, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const W = 400;
const H = 300;

type Crop = { cx: number; cy: number; zoom: number };

function clamp(c: Crop): Crop {
  const half = H / c.zoom / 2;
  return {
    zoom: c.zoom,
    cx: Math.min(W - half, Math.max(half, c.cx)),
    cy: Math.min(H - half, Math.max(half, c.cy)),
  };
}

function viewBox(c: Crop) {
  const s = H / c.zoom;
  return `${(c.cx - s / 2).toFixed(1)} ${(c.cy - s / 2).toFixed(1)} ${s.toFixed(1)} ${s.toFixed(1)}`;
}

function Photo({ vb, className }: { vb: string; className?: string }) {
  return (
    <svg viewBox={vb} className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ic-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c7d8e8" />
          <stop offset="1" stopColor="#e9d6c6" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ic-bg)" />
      <rect x="20" y="200" width="360" height="100" fill="#b9a690" />
      <circle cx="80" cy="70" r="34" fill="#f4e3c3" opacity="0.8" />
      {/* plant */}
      <rect x="318" y="170" width="34" height="40" rx="4" fill="#8a6a50" />
      <ellipse cx="335" cy="150" rx="26" ry="34" fill="#5f8a63" />
      {/* person */}
      <ellipse cx="210" cy="300" rx="92" ry="70" fill="#3e5a7a" />
      <rect x="196" y="190" width="28" height="30" fill="#e8b996" />
      <circle cx="210" cy="150" r="48" fill="#f0c4a2" />
      <path d="M160 150 Q160 92 210 92 Q262 92 260 150 Q250 116 210 116 Q172 116 160 150Z" fill="#2f2a28" />
      <circle cx="193" cy="154" r="4" fill="#2f2a28" />
      <circle cx="227" cy="154" r="4" fill="#2f2a28" />
      <path d="M197 174 Q210 184 223 174" stroke="#b5735a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const INITIAL: Crop = { cx: 210, cy: 165, zoom: 1.6 };

export default function ImageCropper() {
  const [crop, setCrop] = useState<Crop>(INITIAL);
  const [result, setResult] = useState<Crop | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; start: Crop } | null>(null);

  const setZoom = (z: number) => setCrop((c) => clamp({ ...c, zoom: Math.min(3, Math.max(1, z)) }));

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: crop };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !frame.current) return;
    const px = frame.current.getBoundingClientRect().width;
    const k = H / d.start.zoom / px;
    setCrop(clamp({ ...d.start, cx: d.start.cx - (e.clientX - d.x) * k, cy: d.start.cy - (e.clientY - d.y) * k }));
  };
  const endDrag = () => {
    drag.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 8 / crop.zoom;
    const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (map[e.key]) {
      e.preventDefault();
      const [dx, dy] = map[e.key];
      setCrop((c) => clamp({ ...c, cx: c.cx + dx, cy: c.cy + dy }));
    } else if (e.key === "+" || e.key === "=") setZoom(crop.zoom + 0.1);
    else if (e.key === "-") setZoom(crop.zoom - 0.1);
  };

  const size = Math.round(H / crop.zoom);
  const x = Math.round(crop.cx - size / 2);
  const y = Math.round(crop.cy - size / 2);

  return (
    <div className="mx-auto grid w-full max-w-lg gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
      <div className="space-y-3">
        <div
          ref={frame}
          tabIndex={0}
          role="group"
          aria-label="切り抜き範囲。ドラッグまたは矢印キーで移動、+ と - で拡大縮小"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          className="relative mx-auto aspect-square w-full max-w-64 cursor-grab touch-none select-none overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        >
          <Photo vb={viewBox(crop)} className="absolute inset-0 size-full" />
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_999px_rgba(0,0,0,0.45)]" />
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/25" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="縮小" onClick={() => setZoom(crop.zoom - 0.2)} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted">
            <ZoomOut className="size-4" />
          </button>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={crop.zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="ズーム"
            aria-valuetext={`${crop.zoom.toFixed(1)} 倍`}
            className="h-1.5 flex-1 accent-primary"
          />
          <button type="button" aria-label="拡大" onClick={() => setZoom(crop.zoom + 0.2)} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted">
            <ZoomIn className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground tabular-nums">
            {x},{y} · {size}×{size}px
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setCrop(INITIAL); setResult(null); }}>
              <RotateCcw className="size-3.5" />
              リセット
            </Button>
            <Button size="sm" onClick={() => setResult(crop)}>
              <Check className="size-3.5" />
              切り抜く
            </Button>
          </div>
        </div>
      </div>

      <div aria-live="polite" className="rounded-lg border bg-card p-3 sm:w-36">
        <p className="mb-2 text-xs font-medium">プレビュー</p>
        {result ? (
          <div className="flex items-end gap-3">
            <Photo vb={viewBox(result)} className="size-16 rounded-full border" />
            <Photo vb={viewBox(result)} className="size-10 rounded-full border" />
            <Photo vb={viewBox(result)} className="size-6 rounded-full border" />
            <span className="sr-only">アイコンを切り抜きました</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">「切り抜く」でアイコンを確定します</p>
        )}
      </div>
    </div>
  );
}
