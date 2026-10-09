"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DURATION = 420; // 7:00

const chapters = [
  { t: 0, label: "イントロ" },
  { t: 48, label: "環境構築" },
  { t: 150, label: "デモ: 画面の作成" },
  { t: 285, label: "質疑応答" },
  { t: 380, label: "まとめ" },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function ChapterMarkers() {
  const [time, setTime] = useState(170);
  const currentIdx = chapters.reduce((acc, c, i) => (time >= c.t ? i : acc), 0);

  return (
    <div className="mx-auto w-full max-w-lg space-y-3">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="truncate font-medium" aria-live="polite">
          {chapters[currentIdx].label}
        </span>
        <span className="shrink-0 font-mono text-muted-foreground tabular-nums">
          {fmt(time)} / {fmt(DURATION)}
        </span>
      </div>

      {/* チャプターごとにバーを区切る: 各区間の幅 = 区間の長さ / 総尺 */}
      <div className="relative rounded-full ring-offset-4 ring-offset-background has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring">
        <div className="flex h-1.5 gap-0.5" aria-hidden>
          {chapters.map((c, i) => {
            const end = chapters[i + 1]?.t ?? DURATION;
            const len = end - c.t;
            const filled = Math.min(Math.max((time - c.t) / len, 0), 1);
            return (
              <div key={c.t} className="relative h-full overflow-hidden rounded-full bg-muted" style={{ width: `${(len / DURATION) * 100}%` }}>
                <div
                  className="absolute inset-0 origin-left bg-red-600 dark:bg-red-500"
                  style={{ transform: `scaleX(${filled})` }}
                />
              </div>
            );
          })}
        </div>
        <input
          type="range"
          min={0}
          max={DURATION}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          aria-label="再生位置"
          aria-valuetext={`${fmt(time)}、${chapters[currentIdx].label}`}
          className="absolute inset-x-0 -top-2 h-5 w-full cursor-pointer opacity-0"
        />
      </div>

      <ol className="space-y-0.5">
        {chapters.map((c, i) => (
          <li key={c.t}>
            <button
              type="button"
              onClick={() => setTime(c.t)}
              aria-current={i === currentIdx ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                i === currentIdx && "bg-muted font-medium",
              )}
            >
              <span className="w-10 shrink-0 font-mono text-xs text-red-700 tabular-nums dark:text-red-400">{fmt(c.t)}</span>
              <span className="truncate">{c.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
