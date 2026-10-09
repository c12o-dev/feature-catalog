"use client";

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

function Scene({ after }: { after: boolean }) {
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <linearGradient id={after ? "sky-a" : "sky-b"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={after ? "#f6a96b" : "#9a9a9a"} />
          <stop offset="0.6" stopColor={after ? "#f7d9a8" : "#c4c4c4"} />
          <stop offset="1" stopColor={after ? "#9cc3d6" : "#b0b0b0"} />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${after ? "sky-a" : "sky-b"})`} />
      <circle cx="232" cy="70" r="18" fill={after ? "#fff3d6" : "#dedede"} />
      <path d="M0 120 L60 70 L110 110 L170 55 L240 115 L320 80 L320 180 L0 180Z" fill={after ? "#5d7a8c" : "#7c7c7c"} />
      <path d="M0 140 L80 105 L150 135 L220 100 L320 130 L320 180 L0 180Z" fill={after ? "#3d5a4a" : "#5e5e5e"} />
      <rect y="150" width="320" height="30" fill={after ? "#2c4a5c" : "#4a4a4a"} />
      {!after && <rect width="320" height="180" fill="#000" opacity="0.12" />}
    </svg>
  );
}

export default function CompareSlider() {
  const [v, setV] = useState(50);

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <div className="relative aspect-[16/9] select-none overflow-hidden rounded-lg border bg-muted">
        <Scene after={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Scene after />
        </div>

        <span className="absolute left-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-white">補正後</span>
        <span className="absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-white">補正前</span>

        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow" style={{ left: `${v}%` }}>
          <div className="absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-zinc-800 shadow-md ring-1 ring-black/10">
            <ChevronsLeftRight className="size-4" aria-hidden />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          aria-label="補正前後の比較位置"
          aria-valuetext={`補正後 ${v}% 表示`}
          className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-primary ring-offset-0 opacity-0 peer-focus-visible:opacity-100" />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>ドラッグまたは ← → キーで比較</span>
        <span className="tabular-nums">{v}%</span>
      </div>
    </div>
  );
}
