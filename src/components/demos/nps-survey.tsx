"use client";

import { useState } from "react";

export default function NpsSurvey() {
  const [score, setScore] = useState<number | null>(null);
  if (score !== null) return (
    <div className="rounded-md border bg-emerald-50 dark:bg-emerald-950/30 p-4 max-w-md text-emerald-700 dark:text-emerald-300 text-sm">
      ご回答ありがとうございました（{score} / 10）。
    </div>
  );
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-sm">私たちのプロダクトを友人に勧める可能性は？</div>
      <div className="flex gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i} onClick={() => setScore(i)} className="flex-1 aspect-square rounded border text-sm hover:bg-accent tabular-nums">
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground"><span>勧めない</span><span>強く勧める</span></div>
    </div>
  );
}
