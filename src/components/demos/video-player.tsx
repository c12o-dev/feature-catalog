"use client";

import { useEffect, useRef, useState } from "react";
import { Captions, Maximize, Minimize, Pause, Play, Settings, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const DURATION = 242;
const SPEEDS = [0.5, 1, 1.25, 1.5, 2];
const QUALITIES = ["自動", "1080p", "720p", "480p"];
const CUES = [
  "今日は秋の京都を歩いてみます。",
  "まずは早朝の嵐山から。",
  "人が少ない時間帯がおすすめです。",
  "竹林の音、聞こえますか？",
  "このあと渡月橋へ向かいます。",
  "紅葉はまだ色づき始めですね。",
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function VideoPlayer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(84);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState("自動");
  const [cc, setCc] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [menu, setMenu] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setT((v) => (v + 0.25 * speed >= DURATION ? 0 : v + 0.25 * speed)), 250);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen?.();
  };

  const cue = CUES[Math.floor(t / 4) % CUES.length];
  const shownVol = muted ? 0 : volume;

  return (
    <div ref={rootRef} className="relative aspect-video min-h-[200px] w-full overflow-hidden rounded-lg bg-zinc-950 text-white">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg,#f3b07c 0%,#c26e5a 38%,#3f2a3d 70%,#14121c 100%)",
          filter: quality === "480p" ? "blur(1.5px)" : quality === "720p" ? "blur(0.5px)" : undefined,
        }}
      />
      <svg aria-hidden viewBox="0 0 400 225" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        <path d="M0 170 L60 120 L110 150 L170 95 L230 145 L290 110 L350 140 L400 115 L400 225 L0 225Z" fill="#241a26" opacity="0.85" />
        <path d="M0 195 L80 165 L150 185 L220 160 L300 185 L400 165 L400 225 L0 225Z" fill="#120e16" />
      </svg>

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "一時停止" : "再生"}
        className="absolute inset-0 grid place-items-center focus-visible:outline-none"
      >
        {!playing && (
          <span className="grid size-12 place-items-center rounded-full bg-black/50 backdrop-blur-sm">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
        )}
      </button>

      {cc && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-4">
          <p className="rounded bg-black/75 px-2 py-0.5 text-center text-xs sm:text-sm" aria-live="off">
            {cue}
          </p>
        </div>
      )}

      {menu && (
        <div role="dialog" aria-label="再生設定" className="absolute bottom-14 right-2 z-10 w-56 max-w-[calc(100%-1rem)] space-y-3 rounded-lg bg-zinc-900/95 p-3 text-xs shadow-xl ring-1 ring-white/10">
          <div>
            <div className="mb-1.5 text-white/60">再生速度</div>
            <div role="group" aria-label="再生速度" className="flex flex-wrap gap-1">
              {SPEEDS.map((s) => (
                <button key={s} type="button" aria-pressed={speed === s} onClick={() => setSpeed(s)} className="rounded px-2 py-1 tabular-nums hover:bg-white/10 aria-pressed:bg-white aria-pressed:text-zinc-900">
                  {s}x
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-white/60">画質</div>
            <div role="group" aria-label="画質" className="flex flex-wrap gap-1">
              {QUALITIES.map((q) => (
                <button key={q} type="button" aria-pressed={quality === q} onClick={() => setQuality(q)} className="rounded px-2 py-1 hover:bg-white/10 aria-pressed:bg-white aria-pressed:text-zinc-900">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 space-y-1.5 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-6">
        <input
          type="range"
          min={0}
          max={DURATION}
          step={1}
          value={Math.floor(t)}
          onChange={(e) => setT(Number(e.target.value))}
          aria-label="再生位置"
          aria-valuetext={`${fmt(t)} / ${fmt(DURATION)}`}
          className="block h-1 w-full cursor-pointer accent-red-500"
        />
        <div className="flex items-center gap-1 text-xs">
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "一時停止" : "再生"} className="grid size-8 place-items-center rounded hover:bg-white/10">
            {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </button>
          <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "ミュート解除" : "ミュート"} aria-pressed={muted} className="grid size-8 place-items-center rounded hover:bg-white/10">
            {shownVol === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={shownVol}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setMuted(false);
            }}
            aria-label="音量"
            className="hidden h-1 w-16 cursor-pointer accent-white sm:block"
          />
          <span className="ml-1 whitespace-nowrap tabular-nums text-white/80">
            {fmt(t)} / {fmt(DURATION)}
          </span>
          <div className="ml-auto flex items-center">
            <button type="button" onClick={() => setCc((c) => !c)} aria-label="字幕" aria-pressed={cc} className={cn("grid size-8 place-items-center rounded hover:bg-white/10", cc && "text-red-400")}>
              <Captions className="size-4" />
            </button>
            <button type="button" onClick={() => setMenu((m) => !m)} aria-label="設定" aria-expanded={menu} className="grid size-8 place-items-center rounded hover:bg-white/10">
              <Settings className={cn("size-4 transition-transform", menu && "rotate-45")} />
            </button>
            <button type="button" onClick={toggleFull} aria-label={full ? "全画面を終了" : "全画面"} className="grid size-8 place-items-center rounded hover:bg-white/10">
              {full ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            </button>
          </div>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {playing ? `再生中 ${speed}倍速` : "一時停止中"}、画質 {quality}、字幕 {cc ? "オン" : "オフ"}
      </span>
      {(speed !== 1 || quality !== "自動") && (
        <span className="pointer-events-none absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] tabular-nums">
          {speed}x · {quality}
        </span>
      )}
    </div>
  );
}
