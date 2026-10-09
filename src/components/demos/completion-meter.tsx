"use client";

import { useState } from "react";
import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const TASKS = [
  { id: "photo", label: "プロフィール写真", hint: "顔がわかる写真で信頼度が上がります", done: true },
  { id: "bio", label: "自己紹介", hint: "200 字程度で強みを書く", done: true },
  { id: "skills", label: "スキル登録", hint: "得意分野を 3 つ以上", done: true },
  { id: "portfolio", label: "ポートフォリオ", hint: "制作物を 1 件以上追加", done: false },
  { id: "career", label: "経歴", hint: "直近の職歴を追加", done: false },
];

export default function CompletionMeter() {
  const [done, setDone] = useState<Record<string, boolean>>(() => Object.fromEntries(TASKS.map((t) => [t.id, t.done])));
  const count = TASKS.filter((t) => done[t.id]).length;
  const pct = Math.round((count / TASKS.length) * 100);
  const remaining = TASKS.filter((t) => !done[t.id]);
  const r = 36;
  const c = 2 * Math.PI * r;

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-4">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r={r}
              className={cn(
                "fill-none transition-[stroke-dashoffset] duration-700",
                pct === 100 ? "stroke-emerald-500 dark:stroke-emerald-400" : "stroke-sky-500 dark:stroke-sky-400",
              )}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (pct / 100) * c}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-lg font-semibold tabular-nums">{pct}%</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium">プロフィール完成度</div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="プロフィール完成度"
            className="sr-only"
          />
          <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
            {remaining.length === 0 ? "すべて完了しました。検索結果で上位に表示されます。" : `あと ${remaining.length} 項目で完成です`}
          </p>
        </div>
      </div>

      {remaining.length > 0 ? (
        <ul className="divide-y rounded-md border">
          {remaining.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setDone((d) => ({ ...d, [t.id]: true }))}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted"
              >
                <span className="size-4 shrink-0 rounded-full border-2 border-dashed border-muted-foreground/50" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{t.label}を追加</span>
                  <span className="block text-xs text-muted-foreground">{t.hint}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" aria-hidden />
            プロフィールが完成しました
          </span>
          <button
            type="button"
            onClick={() => setDone(Object.fromEntries(TASKS.map((t) => [t.id, t.done])))}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
          >
            <RotateCcw className="size-3" aria-hidden />
            戻す
          </button>
        </div>
      )}

      <ul className="flex flex-wrap gap-1.5" aria-label="完了済み">
        {TASKS.filter((t) => done[t.id]).map((t) => (
          <li key={t.id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            <Check className="size-3" aria-hidden />
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
