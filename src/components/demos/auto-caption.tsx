"use client";

import { useEffect, useRef, useState } from "react";
import { Captions, Loader2, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Lang = "ja" | "en" | "ko";
const LANGS: { v: Lang; l: string }[] = [
  { v: "ja", l: "日本語" },
  { v: "en", l: "English" },
  { v: "ko", l: "한국어" },
];

const CUES: { t: number; ja: string; en: string; ko: string }[] = [
  { t: 0, ja: "こんにちは、今日は新しいダッシュボードを紹介します。", en: "Hi, today I'll walk you through the new dashboard.", ko: "안녕하세요, 오늘은 새 대시보드를 소개합니다." },
  { t: 1.6, ja: "まず左上のメニューからプロジェクトを選びます。", en: "First, pick a project from the menu at the top left.", ko: "먼저 왼쪽 상단 메뉴에서 프로젝트를 선택합니다." },
  { t: 3.2, ja: "グラフは期間を指定して絞り込めます。", en: "You can filter the charts by date range.", ko: "그래프는 기간을 지정해 필터링할 수 있습니다." },
  { t: 4.8, ja: "気になる数値はクリックすると詳細が開きます。", en: "Click any number to open its details.", ko: "궁금한 수치를 클릭하면 상세가 열립니다." },
  { t: 6.4, ja: "そして次のステップに進みます。", en: "And then we move on to the next step.", ko: "그리고 다음 단계로 넘어갑니다." },
];
const DURATION = 8;

const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

export default function AutoCaption() {
  const [gen, setGen] = useState<"none" | "running" | "done">("none");
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState<Lang>("ja");
  const [translating, setTranslating] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const transTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // generation progress (stops itself at 100%)
  useEffect(() => {
    if (gen !== "running" || progress >= 100) return;
    const id = setTimeout(() => setProgress(Math.min(100, progress + 8)), 90);
    return () => clearTimeout(id);
  }, [gen, progress]);

  const ended = time >= DURATION;
  const isPlaying = playing && !ended;

  // playback clock (stops at the end)
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setTime((t) => Math.min(DURATION, t + 0.1)), 100);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => () => {
    if (transTimer.current) clearTimeout(transTimer.current);
  }, []);

  // derived completion — avoids setState in effects
  const genDone = gen === "done" || (gen === "running" && progress >= 100);
  const visibleCount = genDone ? CUES.length : Math.floor((progress / 100) * CUES.length);
  const current = [...CUES].reverse().find((c) => time >= c.t);
  const caption = genDone && !translating && current ? current[lang] : null;

  const startGen = () => {
    setProgress(0);
    setGen("running");
  };

  const changeLang = (l: Lang) => {
    if (l === lang) return;
    setLang(l);
    setTranslating(true);
    if (transTimer.current) clearTimeout(transTimer.current);
    transTimer.current = setTimeout(() => setTranslating(false), 700);
  };

  const togglePlay = () => {
    if (ended) {
      setTime(0);
      setPlaying(true);
      return;
    }
    setPlaying(!playing);
  };

  return (
    <div className="mx-auto max-w-xl space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.25),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(168,85,247,0.2),transparent_55%)]" aria-hidden />
        <div className="absolute inset-x-6 top-6 space-y-2 opacity-40" aria-hidden>
          <div className="h-3 w-1/3 rounded bg-white/40" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 rounded bg-white/20" />
            <div className="h-12 rounded bg-white/20" />
            <div className="h-12 rounded bg-white/20" />
          </div>
        </div>
        {genDone && (
          <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            <Sparkles className="size-2.5" aria-hidden />
            AI 字幕・{LANGS.find((x) => x.v === lang)!.l}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-10 flex justify-center px-3" aria-live="polite">
          {caption && (
            <p className="max-w-[90%] rounded bg-black/80 px-3 py-1 text-center text-xs text-white sm:text-sm">{caption}</p>
          )}
          {translating && (
            <p className="inline-flex items-center gap-1.5 rounded bg-black/70 px-3 py-1 text-xs text-white/80">
              <Loader2 className="size-3 motion-safe:animate-spin" aria-hidden />
              翻訳中…
            </p>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-4 text-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "一時停止" : ended ? "最初から再生" : "再生"}
            className="grid size-7 place-items-center rounded hover:bg-white/15"
          >
            {isPlaying ? <Pause className="size-4" /> : ended ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
          </button>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full origin-left bg-white" style={{ transform: `scaleX(${time / DURATION})` }} />
          </div>
          <span className="text-[11px] tabular-nums">
            {fmt(time)} / {fmt(DURATION)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!genDone ? (
          <Button size="sm" onClick={startGen} disabled={gen === "running"}>
            {gen === "running" ? <Loader2 className="size-3.5 motion-safe:animate-spin" aria-hidden /> : <Captions className="size-3.5" aria-hidden />}
            {gen === "running" ? `字幕を生成中 ${progress}%` : "AI で字幕を生成"}
          </Button>
        ) : (
          <div role="radiogroup" aria-label="字幕の言語" className="inline-flex rounded-md border p-0.5">
            {LANGS.map((l) => (
              <button
                key={l.v}
                type="button"
                role="radio"
                aria-checked={lang === l.v}
                onClick={() => changeLang(l.v)}
                className={cn("rounded px-2.5 py-1 text-xs", lang === l.v ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground")}
              >
                {l.l}
              </button>
            ))}
          </div>
        )}
        <span className="text-xs text-muted-foreground">{genDone ? "言語を切り替えると自動翻訳します" : "音声を解析してタイムコード付き字幕を作ります"}</span>
      </div>

      <ol className="divide-y rounded-lg border bg-card text-sm" aria-label="字幕トラック">
        {CUES.map((c, i) => {
          const shown = i < visibleCount;
          const active = genDone && current === c && (isPlaying || time > 0);
          return (
            <li key={c.t} className={cn("flex gap-3 px-3 py-2", active && "bg-sky-50 dark:bg-sky-500/10")}>
              <span className="w-9 shrink-0 text-xs text-muted-foreground tabular-nums">{fmt(c.t)}</span>
              {shown ? (
                <span className={cn("min-w-0", translating && "opacity-50")}>{c[lang]}</span>
              ) : (
                <span className="h-3 w-3/4 self-center rounded bg-muted" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
