"use client";

import { useState } from "react";

export default function FontSize() {
  const [s, setS] = useState(1);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setS((s) => Math.max(0.7, s - 0.1))} className="rounded-md border px-2 py-1 text-xs">A−</button>
        <span className="text-xs text-muted-foreground tabular-nums">{(s * 100).toFixed(0)}%</span>
        <button onClick={() => setS((s) => Math.min(1.5, s + 0.1))} className="rounded-md border px-2 py-1 text-base">A+</button>
      </div>
      <p className="leading-relaxed transition-[font-size]" style={{ fontSize: `${s}rem` }}>これはサンプル本文です。文字サイズ調整は読みやすさへの配慮として有用です。</p>
    </div>
  );
}
