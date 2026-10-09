"use client";

import { useEffect, useState } from "react";
import { Captions, AudioLines, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const DURATION = 12;
type Cue = { start: number; end: number; text: string };
const captions: Record<"ja" | "en", Cue[]> = {
  ja: [
    { start: 0.5, end: 3.5, text: "おはようございます。今日は新機能を紹介します。" },
    { start: 4, end: 7.5, text: "画面右上のボタンから、すぐに共有できます。" },
    { start: 8, end: 11.5, text: "［拍手］ぜひ試してみてください。" },
  ],
  en: [
    { start: 0.5, end: 3.5, text: "Good morning. Today we'll introduce a new feature." },
    { start: 4, end: 7.5, text: "You can share instantly from the top-right button." },
    { start: 8, end: 11.5, text: "[applause] Give it a try." },
  ],
};
const descriptions: Cue[] = [
  { start: 0, end: 4, text: "白いシャツの女性が、明るいオフィスで手を振る。" },
  { start: 4, end: 8, text: "ノートPCの画面がアップになり、共有ボタンが光る。" },
  { start: 8, end: 12, text: "会議室の数人が笑顔で拍手している。" },
];
const at = (cues: Cue[], t: number) => cues.find((c) => t >= c.start && t < c.end);
const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

export default function Subtitles() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cc, setCc] = useState(true);
  const [ad, setAd] = useState(false);
  const [lang, setLang] = useState<"ja" | "en">("ja");

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 0.25 >= DURATION ? 0 : v + 0.25)), 250);
    return () => clearInterval(id);
  }, [playing]);

  const cue = cc ? at(captions[lang], t) : undefined;
  const desc = ad ? at(descriptions, t) : undefined;

  return (
    <div className="mx-auto max-w-lg space-y-2">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        <div aria-hidden className="absolute inset-0 grid place-items-center">
          <div className={cn("size-16 rounded-full bg-white/10", playing && "motion-safe:animate-pulse")} />
        </div>
        {desc && (
          <div className="absolute inset-x-2 top-2 rounded bg-amber-400/95 px-2 py-1 text-xs text-amber-950">
            <span className="font-semibold">音声説明：</span>{desc.text}
          </div>
        )}
        <div aria-live="polite" className="absolute inset-x-0 bottom-3 flex justify-center px-3">
          {cue && <span className="max-w-[90%] rounded bg-black/80 px-2.5 py-1 text-center text-sm leading-snug text-white">{cue.text}</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
        <button
          type="button"
          aria-label={playing ? "一時停止" : "再生"}
          onClick={() => setPlaying((p) => !p)}
          className="grid size-8 place-items-center rounded-md hover:bg-muted"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={DURATION}
          step={0.25}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          aria-label="再生位置"
          aria-valuetext={`${fmt(t)} / ${fmt(DURATION)}`}
          className="h-1 min-w-16 flex-1 accent-primary"
        />
        <span className="text-xs tabular-nums text-muted-foreground">{fmt(t)} / {fmt(DURATION)}</span>
        <div className="flex basis-full items-center justify-end gap-1 sm:basis-auto">
          <button
            type="button"
            aria-pressed={cc}
            onClick={() => setCc((v) => !v)}
            className={cn("inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs", cc ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            <Captions className="size-4" />字幕
          </button>
          <button
            type="button"
            aria-pressed={ad}
            onClick={() => setAd((v) => !v)}
            className={cn("inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs", ad ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            <AudioLines className="size-4" />音声説明
          </button>
          <select
            aria-label="字幕の言語"
            value={lang}
            disabled={!cc}
            onChange={(e) => setLang(e.target.value as "ja" | "en")}
            className="h-8 rounded-md border bg-background px-1.5 text-xs disabled:opacity-50"
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
}
