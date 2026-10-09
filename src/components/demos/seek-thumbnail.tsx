"use client";

import { useState } from "react";
import { Play } from "lucide-react";

const DURATION = 240;
const SCENES = [
  { name: "オープニング", grad: "from-sky-400 to-indigo-500" },
  { name: "海辺の朝", grad: "from-cyan-300 to-sky-500" },
  { name: "市場を歩く", grad: "from-amber-300 to-orange-500" },
  { name: "夕暮れの港", grad: "from-orange-400 to-rose-600" },
  { name: "エンディング", grad: "from-violet-500 to-slate-800" },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const sceneAt = (sec: number) => SCENES[Math.min(SCENES.length - 1, Math.floor((sec / DURATION) * SCENES.length))];

export default function SeekThumbnail() {
  const [current, setCurrent] = useState(96);
  const [hover, setHover] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);

  const preview = hover ?? (focused ? current : null);
  const pct = (s: number) => (s / DURATION) * 100;

  const posFrom = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    return f * DURATION;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 30, PageDown: -30 }[e.key];
    if (step !== undefined) {
      e.preventDefault();
      setCurrent((c) => Math.min(DURATION, Math.max(0, c + step)));
    } else if (e.key === "Home") {
      e.preventDefault();
      setCurrent(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setCurrent(DURATION);
    }
  };

  const scene = sceneAt(current);

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border bg-neutral-950 text-white">
      <div className={`relative grid aspect-video place-items-center bg-gradient-to-br ${scene.grad}`}>
        <div className="grid size-12 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
          <Play className="ml-0.5 size-5 fill-white" />
        </div>
        <span className="absolute left-3 top-3 rounded bg-black/40 px-1.5 py-0.5 text-xs">{scene.name}</span>
      </div>
      <div className="px-3 pb-3 pt-10">
        <div
          role="slider"
          tabIndex={0}
          aria-label="再生位置"
          aria-valuemin={0}
          aria-valuemax={DURATION}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${fmt(current)} / ${fmt(DURATION)}（${scene.name}）`}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPointerMove={(e) => setHover(posFrom(e))}
          onPointerLeave={() => setHover(null)}
          onPointerDown={(e) => {
            const s = posFrom(e);
            setCurrent(s);
            setHover(s);
          }}
          className="group relative h-4 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25 transition-[height] group-hover:h-1.5">
            {hover !== null && (
              <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${pct(hover)}%` }} />
            )}
            <div className="absolute inset-y-0 left-0 rounded-full bg-rose-500" style={{ width: `${pct(current)}%` }} />
          </div>
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 shadow"
            style={{ left: `${pct(current)}%` }}
          />
          {preview !== null && (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-full mb-2 w-28 -translate-x-1/2"
              style={{ left: `clamp(56px, ${pct(preview)}%, calc(100% - 56px))` }}
            >
              <div className={`aspect-video rounded-md border-2 border-white bg-gradient-to-br shadow-lg ${sceneAt(preview).grad}`} />
              <div className="mt-1 text-center text-[11px] leading-tight">
                <div className="truncate text-white/80">{sceneAt(preview).name}</div>
                <div className="font-medium tabular-nums">{fmt(preview)}</div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-1 flex justify-between text-xs tabular-nums text-white/70">
          <span>{fmt(current)}</span>
          <span>{fmt(DURATION)}</span>
        </div>
      </div>
    </div>
  );
}
