"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const scores = Array.from({ length: 11 }, (_, i) => i);

function tone(i: number) {
  if (i <= 6) return "bg-rose-500 text-white border-rose-500 dark:bg-rose-500";
  if (i <= 8) return "bg-amber-500 text-white border-amber-500 dark:bg-amber-500";
  return "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500";
}

export default function NpsSurvey() {
  const [score, setScore] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const qId = useId();

  const select = (i: number) => {
    setScore(i);
    refs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % 11;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i + 10) % 11;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 10;
    if (next !== null) {
      e.preventDefault();
      select(next);
    }
  };

  if (sent && score !== null) {
    return (
      <div role="status" className="mx-auto flex max-w-md items-start gap-3 rounded-lg border bg-card p-4">
        <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="space-y-1">
          <div className="text-sm font-medium">ご回答ありがとうございました</div>
          <div className="text-xs text-muted-foreground tabular-nums">スコア {score} / 10 を送信しました。</div>
          <button type="button" onClick={() => { setSent(false); setScore(null); }} className="text-xs text-primary underline-offset-2 hover:underline">
            もう一度回答する
          </button>
        </div>
      </div>
    );
  }

  const focusIndex = score ?? 0;

  return (
    <div className="@container mx-auto max-w-md space-y-3 rounded-lg border bg-card p-4">
      <div id={qId} className="text-sm font-medium">このサービスを友人や同僚に勧める可能性はどのくらいですか？</div>
      <div role="radiogroup" aria-labelledby={qId} className="grid grid-cols-6 gap-1 @sm:grid-cols-11">
        {scores.map((i) => {
          const checked = score === i;
          return (
            <button
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={i === focusIndex ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "h-9 rounded-md border text-sm tabular-nums transition-colors",
                checked ? tone(i) : "bg-background hover:bg-muted",
              )}
            >
              {i}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground"><span>0 = 勧めない</span><span>10 = 強く勧める</span></div>
      <div className="flex justify-end">
        <Button size="sm" disabled={score === null} onClick={() => setSent(true)}>送信</Button>
      </div>
    </div>
  );
}
