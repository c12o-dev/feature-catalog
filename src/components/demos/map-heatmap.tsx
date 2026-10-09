"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const W = 400;
const H = 260;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Slot = "morning" | "night";
const HOTSPOTS: Record<Slot, { x: number; y: number; n: number; s: number }[]> = {
  morning: [
    { x: 92, y: 88, n: 260, s: 16 }, // 駅
    { x: 240, y: 88, n: 140, s: 22 },
    { x: 160, y: 60, n: 90, s: 26 },
  ],
  night: [
    { x: 300, y: 70, n: 120, s: 28 },
    { x: 92, y: 88, n: 110, s: 14 },
    { x: 200, y: 140, n: 220, s: 20 }, // 繁華街
  ],
};

function makePoints(slot: Slot) {
  const rnd = mulberry32(slot === "morning" ? 7 : 19);
  const gauss = () => {
    const u = Math.max(rnd(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
  };
  const pts: [number, number][] = [];
  for (const h of HOTSPOTS[slot]) {
    for (let i = 0; i < h.n; i++) pts.push([h.x + gauss() * h.s, h.y + gauss() * h.s]);
  }
  for (let i = 0; i < 120; i++) pts.push([rnd() * W, rnd() * H]);
  return pts;
}

// transparent → blue → green → yellow → red
function buildPalette() {
  const stops: [number, [number, number, number, number]][] = [
    [0, [0, 0, 255, 0]],
    [0.25, [37, 99, 235, 140]],
    [0.5, [34, 197, 94, 190]],
    [0.75, [250, 204, 21, 215]],
    [1, [239, 68, 68, 235]],
  ];
  const out = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let k = 0;
    while (k < stops.length - 2 && t > stops[k + 1][0]) k++;
    const [t0, c0] = stops[k];
    const [t1, c1] = stops[k + 1];
    const f = (t - t0) / (t1 - t0);
    for (let j = 0; j < 4; j++) out[i * 4 + j] = c0[j] + (c1[j] - c0[j]) * f;
  }
  return out;
}

function MapBase() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
      <rect width={W} height={H} className="fill-[#eef0ea] dark:fill-[#1b201d]" />
      <path
        d="M-10 205 C 80 175, 140 245, 230 215 S 360 165, 410 185 L410 225 C 350 210, 300 255, 230 250 S 90 215, -10 240 Z"
        className="fill-sky-200 dark:fill-sky-950"
      />
      <rect x="270" y="105" width="100" height="60" rx="8" className="fill-emerald-200/80 dark:fill-emerald-950" />
      {[[20, 20], [110, 20], [180, 20], [255, 20], [20, 100], [110, 100], [180, 100], [20, 150], [110, 150]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="58" height="58" rx="3" className="fill-white/80 dark:fill-neutral-800" />
      ))}
      <g className="stroke-white dark:stroke-neutral-700" strokeWidth="7" fill="none">
        <path d="M0 88 H400" />
        <path d="M92 0 V260" />
        <path d="M240 0 V200" />
        <path d="M150 260 L 330 0" />
      </g>
      <g fontSize="8" fontFamily="sans-serif" className="fill-neutral-500 dark:fill-neutral-400">
        <text x="70" y="78">中央駅</text>
        <text x="290" y="140">みなと公園</text>
        <text x="40" y="232">桜川</text>
      </g>
    </svg>
  );
}

const PALETTE = buildPalette();

export default function MapHeatmap() {
  const [slot, setSlot] = useState<Slot>("morning");
  const [radius, setRadius] = useState(14);
  const ref = useRef<HTMLCanvasElement>(null);
  const points = useMemo(() => makePoints(slot), [slot]);
  const palette = PALETTE;

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d", { willReadFrequently: true });
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, W, H);
    // 1) accumulate density as alpha with soft radial blobs
    for (const [x, y] of points) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, "rgba(0,0,0,0.14)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    // 2) colourise alpha through the palette
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (a === 0) continue;
      const p = a * 4;
      d[i] = palette[p];
      d[i + 1] = palette[p + 1];
      d[i + 2] = palette[p + 2];
      d[i + 3] = palette[p + 3];
    }
    ctx.putImageData(img, 0, 0);
  }, [points, radius, palette]);

  return (
    <div className="mx-auto w-full max-w-lg space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="radiogroup" aria-label="時間帯" className="inline-flex rounded-md border p-0.5">
          {(["morning", "night"] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={slot === s}
              onClick={() => setSlot(s)}
              className={`rounded px-2.5 py-1 text-xs ${slot === s ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s === "morning" ? "朝 7–9 時" : "夜 19–22 時"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          半径
          <input
            type="range"
            min={8}
            max={24}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-24 accent-foreground"
          />
          <span className="w-6 tabular-nums">{radius}</span>
        </label>
      </div>
      <div className="relative aspect-[400/260] overflow-hidden rounded-lg border">
        <MapBase />
        <canvas
          ref={ref}
          width={W}
          height={H}
          role="img"
          aria-label={`${slot === "morning" ? "朝" : "夜"}の人流ヒートマップ。${points.length} 件の位置情報`}
          className="absolute inset-0 size-full"
        />
        <div className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1.5 shadow-sm backdrop-blur">
          <div className="mb-1 text-[11px] text-muted-foreground">人の密度</div>
          <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-600/50 via-green-500 via-60% to-red-500" />
          <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
            <span>低</span>
            <span>高</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        <span className="tabular-nums">{points.length}</span> 件の位置情報を重ね合わせて表示
      </p>
    </div>
  );
}
