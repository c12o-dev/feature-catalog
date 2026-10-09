"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type HSL = { h: number; s: number; l: number };

const PALETTE: (HSL & { name: string })[] = [
  { name: "藍", h: 217, s: 91, l: 60 },
  { name: "若竹", h: 160, s: 84, l: 39 },
  { name: "山吹", h: 38, s: 92, l: 50 },
  { name: "朱", h: 0, s: 84, l: 60 },
  { name: "菫", h: 258, s: 90, l: 66 },
  { name: "桃", h: 330, s: 81, l: 60 },
  { name: "青磁", h: 173, s: 80, l: 40 },
  { name: "墨", h: 220, s: 13, l: 18 },
];

function toHex({ h, s, l }: HSL) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

const css = (c: HSL) => `hsl(${c.h} ${c.s}% ${c.l}%)`;

export default function ColorPicker() {
  const [c, setC] = useState<HSL>({ h: 217, s: 91, l: 60 });
  const id = useId();

  const sliders = [
    {
      key: "h" as const,
      label: "色相",
      max: 360,
      unit: "°",
      track: "linear-gradient(to right, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))",
    },
    { key: "s" as const, label: "彩度", max: 100, unit: "%", track: `linear-gradient(to right, ${css({ ...c, s: 0 })}, ${css({ ...c, s: 100 })})` },
    {
      key: "l" as const,
      label: "明度",
      max: 100,
      unit: "%",
      track: `linear-gradient(to right, #000, ${css({ ...c, l: 50 })}, #fff)`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xs space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="size-14 shrink-0 rounded-md border shadow-inner" style={{ background: css(c) }} aria-hidden />
        <div className="min-w-0 space-y-0.5 font-mono text-xs tabular-nums">
          <output htmlFor={`${id}-h ${id}-s ${id}-l`} className="block text-sm text-foreground">
            {toHex(c)}
          </output>
          <div className="text-muted-foreground">
            hsl({c.h} {c.s}% {c.l}%)
          </div>
        </div>
      </div>

      {sliders.map((sl) => (
        <div key={sl.key} className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label htmlFor={`${id}-${sl.key}`} className="font-medium">
              {sl.label}
            </label>
            <span className="text-muted-foreground tabular-nums">
              {c[sl.key]}
              {sl.unit}
            </span>
          </div>
          <input
            id={`${id}-${sl.key}`}
            type="range"
            min={0}
            max={sl.max}
            value={c[sl.key]}
            onChange={(e) => setC((p) => ({ ...p, [sl.key]: +e.target.value }))}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full border [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:shadow [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-black/30"
            style={{ background: sl.track }}
          />
        </div>
      ))}

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium">パレット</legend>
        <div className="flex flex-wrap gap-1.5">
          {PALETTE.map((p) => {
            const on = p.h === c.h && p.s === c.s && p.l === c.l;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setC({ h: p.h, s: p.s, l: p.l })}
                aria-label={`${p.name} ${toHex(p)}`}
                aria-pressed={on}
                title={p.name}
                className={cn(
                  "grid size-7 place-items-center rounded-md border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
                  on && "ring-2 ring-foreground ring-offset-1 ring-offset-card",
                )}
                style={{ background: css(p) }}
              >
                {on && <Check className={cn("size-3.5", p.l > 55 ? "text-black" : "text-white")} aria-hidden />}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
