"use client";

import { useEffect, useState } from "react";
import { Moon, Pause, Play, Volume1 } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [5, 15, 30, 60];
const SPEED = 60; // demo runs 60x faster: 1 minute passes per second
const TICK = 250; // ms
const FADE = 30; // seconds of fade-out before stopping

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function SleepTimer() {
  const [playing, setPlaying] = useState(true);
  const [timer, setTimer] = useState<number | null>(null); // minutes chosen
  const [left, setLeft] = useState(0); // seconds remaining

  const done = timer !== null && left <= 0;

  useEffect(() => {
    if (timer === null || !playing || done) return;
    const id = setInterval(() => {
      setLeft((l) => Math.max(0, l - (SPEED * TICK) / 1000));
    }, TICK);
    return () => clearInterval(id);
  }, [timer, playing, done]);

  // Reaching zero stops playback: "playing" is derived, so nothing needs to be set from an effect.
  const isPlaying = playing && !done;
  const volume = timer !== null && left < FADE ? left / FADE : 1;

  const choose = (m: number | null) => {
    if (m === null) {
      setTimer(null);
      return;
    }
    setTimer(m);
    setLeft(m * 60);
    setPlaying(true);
  };

  const status = done ? "タイマーで再生を停止しました" : timer !== null ? `${timer} 分後に停止します` : "タイマーなし";

  return (
    <div className="mx-auto w-full max-w-sm space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-md bg-indigo-100 dark:bg-indigo-950">
          <Moon className="size-5 text-indigo-600 dark:text-indigo-300" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">雨音と焚き火</div>
          <div className="text-xs text-muted-foreground">ねむりの音 · 2 時間</div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (done) {
              setTimer(null);
              setPlaying(true);
            } else setPlaying((p) => !p);
          }}
          aria-label={isPlaying ? "一時停止" : "再生"}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
        >
          {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-hidden>
        <Volume1 className="size-3.5" />
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full origin-left bg-foreground/60" style={{ transform: `scaleX(${isPlaying ? volume : 0})` }} />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">スリープタイマー</legend>
        <div className="grid grid-cols-5 gap-1">
          {[null, ...OPTIONS].map((o) => {
            const on = timer === o;
            return (
              <button
                key={o ?? "off"}
                type="button"
                aria-pressed={on}
                onClick={() => choose(o)}
                className={cn(
                  "rounded-md border px-1 py-1.5 text-xs tabular-nums",
                  on ? "border-foreground bg-foreground text-background" : "bg-background hover:bg-muted",
                )}
              >
                {o === null ? "オフ" : `${o}分`}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-baseline justify-between gap-2">
        <p role="status" className={cn("text-xs", done ? "text-foreground" : "text-muted-foreground")}>
          {status}
        </p>
        {timer !== null && !done && (
          <span className="text-lg font-semibold tabular-nums" aria-hidden>
            {fmt(left)}
          </span>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">デモは 60 倍速で進みます（最後の 30 秒で音量を下げてから停止）</p>
    </div>
  );
}
