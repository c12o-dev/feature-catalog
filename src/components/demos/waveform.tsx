"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";

const DURATION = 228; // 3:48
const BARS = 72;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r = mulberry32(7);
const peaks = Array.from({ length: BARS }, (_, i) => {
  const env = 0.45 + 0.55 * Math.sin((i / BARS) * Math.PI) ** 0.6;
  return Math.max(0.12, Math.min(1, env * (0.35 + r() * 0.65)));
});

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export default function Waveform() {
  const [time, setTime] = useState(74);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const last = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    last.current = 0;
    const tick = (now: number) => {
      const dt = last.current ? (now - last.current) / 1000 : 0;
      last.current = now;
      setTime((t) => (t + dt >= DURATION ? 0 : t + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const progress = time / DURATION;
  const seekFromX = (el: HTMLElement, clientX: number) => {
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 5;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = time + step;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = time - step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = DURATION - 1;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setPlaying((p) => !p);
      return;
    }
    if (next !== null) {
      e.preventDefault();
      setTime(Math.min(DURATION - 1, Math.max(0, next)));
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "一時停止" : "再生"}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
        </button>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">第 42 回 週次ふりかえり</div>
          <div className="text-xs text-muted-foreground">録音 · 2026/10/01</div>
        </div>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label="再生位置"
        aria-valuemin={0}
        aria-valuemax={DURATION}
        aria-valuenow={Math.floor(time)}
        aria-valuetext={`${fmt(time)} / ${fmt(DURATION)}`}
        onKeyDown={onKey}
        onPointerDown={(e) => setTime(seekFromX(e.currentTarget, e.clientX) * DURATION)}
        onPointerMove={(e) => setHover(seekFromX(e.currentTarget, e.clientX))}
        onPointerLeave={() => setHover(null)}
        className="relative flex h-16 cursor-pointer touch-none items-center gap-[2px] rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {peaks.map((p, i) => {
          const at = (i + 0.5) / BARS;
          const played = at <= progress;
          const hovered = hover !== null && at <= hover && !played;
          return (
            <span
              key={i}
              className={`min-w-0 flex-1 rounded-full ${
                played ? "bg-primary" : hovered ? "bg-muted-foreground/60" : "bg-muted-foreground/25"
              } ${reduced ? "" : "transition-colors duration-150"}`}
              style={{ height: `${p * 100}%` }}
            />
          );
        })}
        {hover !== null && (
          <span
            className="pointer-events-none absolute -top-6 -translate-x-1/2 rounded bg-popover px-1.5 py-0.5 text-[10px] text-popover-foreground shadow tabular-nums"
            style={{ left: `${hover * 100}%` }}
          >
            {fmt(hover * DURATION)}
          </span>
        )}
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{fmt(time)}</span>
        <span>{fmt(DURATION)}</span>
      </div>
    </div>
  );
}
