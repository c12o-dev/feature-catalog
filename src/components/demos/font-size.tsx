"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

const STEPS = [87.5, 100, 112.5, 125, 150];
const DEFAULT = 1;

export default function FontSize() {
  const [i, setI] = useState(DEFAULT);
  const pct = STEPS[i];

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">文字サイズ</span>
        <div role="group" aria-label="文字サイズ調整" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            aria-label="文字を小さくする"
            className="grid h-8 min-w-8 place-items-center rounded-md border px-2 text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
          >
            A−
          </button>
          <output aria-live="polite" aria-label="現在の文字サイズ" className="w-12 text-center text-xs tabular-nums text-muted-foreground">
            {pct}%
          </output>
          <button
            type="button"
            onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
            disabled={i === STEPS.length - 1}
            aria-label="文字を大きくする"
            className="grid h-8 min-w-8 place-items-center rounded-md border px-2 text-base font-medium hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => setI(DEFAULT)}
            disabled={i === DEFAULT}
            aria-label="標準の文字サイズに戻す"
            className="ml-1 grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>
      <article className="space-y-2 p-4" style={{ fontSize: `${(pct / 100) * 0.875}rem` }}>
        <h3 className="text-[1.25em] font-semibold leading-snug">秋の夜長に読みたい 3 冊</h3>
        <p className="text-[1em] leading-relaxed text-muted-foreground">
          日が短くなると、読書の時間が自然と増えます。今回は、通勤のすき間でも少しずつ読み進められる短編集を中心に選びました。
        </p>
        <p className="text-[0.85em] text-muted-foreground">2026年10月1日 · 4 分で読めます</p>
      </article>
    </div>
  );
}
