"use client";

import { useEffect, useState } from "react";
import { Filter, Lightbulb, Share2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

const targets = [
  { icon: Filter, label: "絞り込み", title: "条件で絞り込み", body: "担当者や期限でタスクを絞り込めます。よく使う条件は保存できます。" },
  { icon: Sparkles, label: "AI 要約", title: "新機能: AI 要約", body: "長いスレッドを 3 行に要約します。会議前の確認に便利です。" },
  { icon: Share2, label: "共有", title: "リンクで共有", body: "閲覧のみ・編集可などの権限を選んでリンクを発行できます。" },
];

export default function Coachmark() {
  const [step, setStep] = useState<number | null>(1);
  const [used, setUsed] = useState<string | null>(null);

  useEffect(() => {
    if (step === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStep(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const t = step !== null ? targets[step] : null;
  const center = step !== null ? ((step + 0.5) / targets.length) * 100 : 0;

  return (
    <div className="relative min-h-60 rounded-lg border bg-card p-3">
      <div className="grid grid-cols-3 gap-2">
        {targets.map((x, i) => (
          <div key={x.label} className="relative flex justify-center">
            {step === i && (
              <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-lg ring-2 ring-amber-400/80 dark:ring-amber-300/70" />
            )}
            <button
              type="button"
              onClick={() => {
                setUsed(x.label);
                if (step === i) setStep(null);
              }}
              aria-describedby={step === i ? "coachmark-tip" : undefined}
              className="relative flex w-full items-center justify-center gap-1.5 rounded-md border bg-background px-2 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              <x.icon className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{x.label}</span>
              {i === 1 && step !== 1 && <span className="absolute -right-1 -top-1 size-2 rounded-full bg-amber-500" aria-label="新機能" />}
            </button>
          </div>
        ))}
      </div>

      {t && (
        <div id="coachmark-tip" role="dialog" aria-label="ヒント" className="relative mt-4">
          <span
            aria-hidden
            className="absolute -top-1.5 size-3 -translate-x-1/2 rotate-45 border-l border-t bg-popover transition-[left]"
            style={{ left: `${center}%` }}
          />
          <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
              <button type="button" onClick={() => setStep(null)} aria-label="ヒントを閉じる" className="-m-1 grid size-6 shrink-0 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground tabular-nums">
                {(step ?? 0) + 1} / {targets.length}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((s) => (s === null ? s : s - 1))}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent disabled:opacity-40"
                >
                  戻る
                </button>
                <button
                  type="button"
                  onClick={() => setStep((s) => (s === null || s >= targets.length - 1 ? null : s + 1))}
                  className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                >
                  {step === targets.length - 1 ? "完了" : "次へ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!t && (
        <div className="mt-4 space-y-2 text-center">
          <p className={cn("text-xs text-muted-foreground")} aria-live="polite">
            {used ? `「${used}」を押しました` : "ヒントを閉じました"}
          </p>
          <button type="button" onClick={() => setStep(0)} className="text-xs underline underline-offset-2 hover:text-foreground text-muted-foreground">
            ヒントをもう一度見る
          </button>
        </div>
      )}
    </div>
  );
}
