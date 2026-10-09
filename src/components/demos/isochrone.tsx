"use client";

import { useState } from "react";
import { Bike, Car, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

const W = 320;
const H = 200;
const O = { x: 150, y: 104 }; // origin (the shop)
const MINUTES = [5, 10, 15, 20];

const MODES = [
  { id: "walk", label: "徒歩", icon: Footprints, scale: 0.55 },
  { id: "bike", label: "自転車", icon: Bike, scale: 1 },
  { id: "car", label: "車", icon: Car, scale: 1.6 },
] as const;
type Mode = (typeof MODES)[number]["id"];

// Sequential ramp: darkest = closest
const FILL = ["fill-violet-600/45", "fill-violet-500/30", "fill-violet-400/20", "fill-violet-300/15"];
const STROKE = ["stroke-violet-700 dark:stroke-violet-300", "stroke-violet-600 dark:stroke-violet-400", "stroke-violet-500", "stroke-violet-400 dark:stroke-violet-600"];
const SWATCH = ["bg-violet-600/60", "bg-violet-500/45", "bg-violet-400/35", "bg-violet-300/30"];

// Irregular isochrone polygon: travel is faster along the main roads (E–W and N–S) and slower across the river.
function polygon(min: number, scale: number) {
  const pts: string[] = [];
  const base = min * 4.2 * scale;
  for (let k = 0; k < 48; k++) {
    const th = (k / 48) * Math.PI * 2;
    const roads = 1 + 0.28 * Math.pow(Math.abs(Math.cos(2 * th)), 3);
    const river = Math.sin(th) < -0.3 ? 0.72 : 1; // north side is across the river
    const noise = 1 + 0.07 * Math.sin(5 * th + min) + 0.05 * Math.cos(9 * th);
    const r = base * roads * river * noise;
    pts.push(`${(O.x + r * Math.cos(th)).toFixed(1)},${(O.y + r * Math.sin(th)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function Isochrone() {
  const [mode, setMode] = useState<Mode>("bike");
  const [focus, setFocus] = useState<number | null>(null);
  const scale = MODES.find((m) => m.id === mode)!.scale;

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">店舗からの到達圏</span>
        <div role="radiogroup" aria-label="移動手段" className="inline-flex rounded-md bg-muted p-0.5 text-xs">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              tabIndex={mode === m.id ? 0 : -1}
              onClick={() => setMode(m.id)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const i = MODES.findIndex((x) => x.id === mode);
                const n = (i + (e.key === "ArrowRight" ? 1 : MODES.length - 1)) % MODES.length;
                setMode(MODES[n].id);
                (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
              }}
              className={cn("inline-flex items-center gap-1 rounded px-2 py-1", mode === m.id ? "bg-background font-medium shadow-xs" : "text-muted-foreground")}
            >
              <m.icon className="size-3.5" aria-hidden />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-muted/40">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`${MODES.find((m) => m.id === mode)!.label}での 5〜20 分到達圏`}>
          {/* base map */}
          <path d={`M0 52 C80 40 140 70 200 46 S300 30 ${W} 40`} className="fill-none stroke-sky-300 dark:stroke-sky-800" strokeWidth={10} />
          <line x1={0} y1={O.y} x2={W} y2={O.y} className="stroke-background" strokeWidth={5} />
          <line x1={O.x} y1={0} x2={O.x} y2={H} className="stroke-background" strokeWidth={5} />
          <line x1={20} y1={180} x2={300} y2={130} className="stroke-background" strokeWidth={3} />
          <line x1={60} y1={0} x2={110} y2={H} className="stroke-background" strokeWidth={2} />
          <line x1={250} y1={0} x2={230} y2={H} className="stroke-background" strokeWidth={2} />
          {/* bands: largest first so smaller ones sit on top */}
          {[...MINUTES].reverse().map((m) => {
            const i = MINUTES.indexOf(m);
            const dim = focus !== null && focus !== i;
            return (
              <polygon
                key={`${mode}-${m}`}
                points={polygon(m, scale)}
                className={cn(FILL[i], STROKE[i], "transition-opacity")}
                strokeWidth={1}
                strokeLinejoin="round"
                opacity={dim ? 0.25 : 1}
              />
            );
          })}
          <circle cx={O.x} cy={O.y} r={5} className="fill-foreground stroke-background" strokeWidth={2} />
          <text x={O.x + 8} y={O.y - 8} fontSize={10} className="fill-foreground font-medium">
            店舗
          </text>
        </svg>
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs" aria-label="凡例">
        {MINUTES.map((m, i) => (
          <li key={m}>
            <button
              type="button"
              aria-pressed={focus === i}
              onClick={() => setFocus((f) => (f === i ? null : i))}
              className={cn("inline-flex items-center gap-1.5 rounded px-1 py-0.5 hover:bg-muted", focus === i && "bg-muted font-medium")}
            >
              <span className={cn("size-3 rounded-sm border border-violet-500/60", SWATCH[i])} aria-hidden />
              {m} 分以内
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
