"use client";

import { useEffect, useState } from "react";
import { Heart, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const TRACKS = [
  { title: "夜明けのプラットフォーム", artist: "ミナトリオ", dur: 214, from: "#6366f1", to: "#0ea5e9", shape: "circle" },
  { title: "紙飛行機と午後", artist: "Sora Kitano", dur: 187, from: "#f97316", to: "#e11d48", shape: "wave" },
  { title: "湾岸ハイウェイ", artist: "ネオンの庭", dur: 242, from: "#14b8a6", to: "#1e293b", shape: "grid" },
] as const;

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Jacket({ i, playing }: { i: number; playing: boolean }) {
  const t = TRACKS[i];
  return (
    <div
      aria-hidden
      className="relative size-16 shrink-0 overflow-hidden rounded-md shadow-sm sm:size-20"
      style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
    >
      <svg viewBox="0 0 80 80" className="absolute inset-0 size-full opacity-60">
        {t.shape === "circle" && <circle cx="56" cy="26" r="16" fill="white" fillOpacity="0.5" />}
        {t.shape === "wave" && <path d="M0 52 Q20 36 40 52 T80 52 V80 H0Z" fill="white" fillOpacity="0.4" />}
        {t.shape === "grid" &&
          [16, 32, 48, 64].map((v) => <line key={v} x1={v} y1="0" x2={v} y2="80" stroke="white" strokeOpacity="0.35" />)}
      </svg>
      {playing && <span className="absolute bottom-1 right-1 size-2 rounded-full bg-white motion-safe:animate-pulse" />}
    </div>
  );
}

export default function AudioPlayer() {
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(64);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const track = TRACKS[idx];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPos((p) => p + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [playing]);

  // 曲の終わりに達したら次の曲へ（レンダー中の派生 state 調整。次のレンダーで atEnd は false になる）
  const atEnd = pos >= track.dur;
  if (atEnd) {
    setIdx((i) => (i + 1) % TRACKS.length);
    setPos(0);
  }

  const go = (d: 1 | -1) => {
    if (d === -1 && pos > 3) {
      setPos(0);
      return;
    }
    setIdx((i) => (i + d + TRACKS.length) % TRACKS.length);
    setPos(0);
  };

  const pct = Math.min(100, (pos / track.dur) * 100);

  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex items-center gap-3">
        <Jacket i={idx} playing={playing} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium" aria-live="polite">
            {track.title}
          </div>
          <div className="truncate text-xs text-muted-foreground">{track.artist}</div>
        </div>
        <button
          type="button"
          aria-label={liked ? "お気に入りから外す" : "お気に入りに追加"}
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
          className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Heart aria-hidden className={cn("size-4", liked && "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400")} />
        </button>
      </div>

      <div className="mt-3">
        <div className="relative h-4 rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full origin-left rounded-full bg-foreground" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <input
            type="range"
            min={0}
            max={track.dur}
            step={1}
            value={Math.min(pos, track.dur)}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="再生位置"
            aria-valuetext={`${fmt(pos)} / ${fmt(track.dur)}`}
            className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
        </div>
        <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
          <span>{fmt(pos)}</span>
          <span>-{fmt(Math.max(0, track.dur - pos))}</span>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-center gap-3">
        <button type="button" aria-label="前の曲" onClick={() => go(-1)} className="grid size-9 place-items-center rounded-full hover:bg-muted">
          <SkipBack aria-hidden className="size-4 fill-current" />
        </button>
        <button
          type="button"
          aria-label={playing ? "一時停止" : "再生"}
          onClick={() => setPlaying((v) => !v)}
          className="grid size-11 place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? <Pause aria-hidden className="size-5 fill-current" /> : <Play aria-hidden className="ml-0.5 size-5 fill-current" />}
        </button>
        <button type="button" aria-label="次の曲" onClick={() => go(1)} className="grid size-9 place-items-center rounded-full hover:bg-muted">
          <SkipForward aria-hidden className="size-4 fill-current" />
        </button>
      </div>

      <ol className="mt-2 space-y-0.5 border-t pt-2">
        {TRACKS.map((t, i) => (
          <li key={t.title}>
            <button
              type="button"
              aria-current={i === idx ? "true" : undefined}
              onClick={() => {
                setIdx(i);
                setPos(0);
                setPlaying(true);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-muted",
                i === idx ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="w-3 tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate">{t.title}</span>
              <span className="tabular-nums">{fmt(t.dur)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
