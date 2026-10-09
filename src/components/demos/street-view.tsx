"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const PANO_W = 1440; // px for a full 360°
const H = 200;

// Deterministic skyline
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}
const r = rng(42);
const BUILDINGS = Array.from({ length: 46 }, (_, i) => {
  const w = 22 + r() * 30;
  const h = 40 + r() * 70;
  return { x: i * 31 + r() * 8, w, h, shade: 0.55 + r() * 0.35, windows: r() > 0.35 };
});

const LANDMARKS = [
  { deg: 0, label: "北", name: "見晴山" },
  { deg: 90, label: "東", name: "中央駅" },
  { deg: 180, label: "南", name: "桜川" },
  { deg: 270, label: "西", name: "市民公園" },
];

const SCENES = [
  { name: "駅前通り 3 丁目", sky: ["#7cb7e8", "#cfe6f7"] },
  { name: "駅前通り 5 丁目（夕方）", sky: ["#f2a46b", "#f7d6b0"] },
];

function Panorama({ sky, id }: { sky: string[]; id: string }) {
  return (
    <svg width={PANO_W} height={H} viewBox={`0 0 ${PANO_W} ${H}`} className="block shrink-0" aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width={PANO_W} height={H} fill={`url(#${id}-sky)`} />
      {/* north mountain */}
      <path d={`M${PANO_W - 160} 140 L${PANO_W - 60} 70 L${PANO_W} 110 L${PANO_W} 140 Z`} fill="#6b8f71" opacity="0.8" />
      <path d="M0 110 L60 70 L170 140 L0 140 Z" fill="#6b8f71" opacity="0.8" />
      {/* skyline */}
      {BUILDINGS.map((b, i) => {
        const deg = (b.x / PANO_W) * 360;
        if ((deg > 240 && deg < 300) || deg < 20 || deg > 340) return null; // park & mountain views stay open
        return (
          <g key={i}>
            <rect x={b.x} y={150 - b.h} width={b.w} height={b.h} fill={`rgba(40,48,66,${b.shade})`} />
            {b.windows &&
              Array.from({ length: Math.floor(b.h / 14) }, (_, k) => (
                <rect key={k} x={b.x + 5} y={150 - b.h + 6 + k * 14} width={b.w - 10} height={4} fill="#f8e7a1" opacity="0.35" />
              ))}
          </g>
        );
      })}
      {/* station */}
      <rect x={300} y={95} width={140} height={55} fill="#3f4a5e" />
      <rect x={300} y={88} width={140} height={10} fill="#c0533b" />
      {/* river & bridge (south) */}
      <rect x={640} y={150} width={160} height={50} fill="#5b9bc7" />
      <path d="M640 150 Q720 120 800 150" stroke="#e5e7eb" strokeWidth="5" fill="none" />
      {/* park trees (west) */}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <rect x={985 + i * 22} y={128} width={4} height={22} fill="#6b4f3a" />
          <circle cx={987 + i * 22} cy={122} r={13} fill={i % 2 ? "#4e8f5a" : "#5fa36b"} />
        </g>
      ))}
      {/* road */}
      <rect y={150} width={PANO_W} height={50} fill="#4b5161" />
      <rect x={0} y={150} width={640} height={50} fill="#4b5161" />
      {Array.from({ length: 36 }, (_, i) => (
        <rect key={i} x={i * 40 + 8} y={174} width={20} height={3} fill="#e5e7eb" opacity="0.7" />
      ))}
      {LANDMARKS.map((l) => (
        <g key={l.deg} transform={`translate(${(l.deg / 360) * PANO_W + (l.deg === 0 ? 40 : 0)} 30)`}>
          <rect x={-34} y={-12} width={68} height={22} rx={11} fill="rgba(0,0,0,0.55)" />
          <text x={0} y={3} textAnchor="middle" fontSize="11" fill="#fff">
            {l.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function StreetView() {
  const [heading, setHeading] = useState(30);
  const [scene, setScene] = useState(0);
  const drag = useRef<{ x: number; h: number } | null>(null);

  const norm = (d: number) => ((d % 360) + 360) % 360;
  const offset = -(heading / 360) * PANO_W;
  const facing = LANDMARKS.reduce((best, l) => {
    const diff = (d: number) => Math.min(Math.abs(d - heading), 360 - Math.abs(d - heading));
    return diff(l.deg) < diff(best.deg) ? l : best;
  });

  return (
    <div className="w-full space-y-2">
      <div className="relative h-[200px]">
      <div
        role="slider"
        tabIndex={0}
        aria-label="視点の向き（左右キーで回転）"
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={Math.round(heading)}
        aria-valuetext={`${Math.round(heading)}°、${facing.label}向き（${facing.name}）`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setHeading((h) => norm(h - 15));
          else if (e.key === "ArrowRight") setHeading((h) => norm(h + 15));
          else return;
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, h: heading };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setHeading(norm(drag.current.h - ((e.clientX - drag.current.x) / PANO_W) * 360 * 1.5));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        className="absolute inset-0 cursor-grab touch-pan-y select-none overflow-hidden rounded-lg border outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      >
        {/* centre the view: the strip is drawn twice so it wraps seamlessly */}
        <div className="absolute left-1/2 top-0 flex will-change-transform" style={{ transform: `translateX(${offset - PANO_W}px)` }}>
          <Panorama sky={SCENES[scene].sky} id={`a${scene}`} />
          <Panorama sky={SCENES[scene].sky} id={`b${scene}`} />
          <Panorama sky={SCENES[scene].sky} id={`c${scene}`} />
        </div>

        <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-xs text-white">
          <MapPin className="size-3" aria-hidden />
          {SCENES[scene].name}
        </div>

        <div className="pointer-events-none absolute bottom-2 right-2 size-11 rounded-full bg-background/90 shadow" aria-hidden>
          <div className="absolute inset-1" style={{ transform: `rotate(${-heading}deg)` }}>
            <span className="absolute left-1/2 top-0 -translate-x-1/2 text-[9px] font-bold leading-none text-red-600 dark:text-red-400">N</span>
          </div>
          <Navigation className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 fill-current text-foreground" />
        </div>
      </div>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setScene((s) => (s + 1) % SCENES.length)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 shadow hover:bg-white"
        >
          前へ進む ↑
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <button type="button" onClick={() => setHeading((h) => norm(h - 45))} aria-label="左に回転" className="grid size-7 place-items-center rounded-md border bg-background hover:bg-muted">
          <ChevronLeft className="size-4" />
        </button>
        <span className="tabular-nums">
          {facing.label}向き · {Math.round(heading)}° · ドラッグで見回す
        </span>
        <button type="button" onClick={() => setHeading((h) => norm(h + 45))} aria-label="右に回転" className={cn("grid size-7 place-items-center rounded-md border bg-background hover:bg-muted")}>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
