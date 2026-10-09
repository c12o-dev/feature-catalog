"use client";

import { useState } from "react";

export default function RangeSlider() {
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(80);
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-sm">価格範囲: <span className="font-mono tabular-nums">¥{min * 100}</span> 〜 <span className="font-mono tabular-nums">¥{max * 100}</span></div>
      <div className="relative h-6">
        <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-muted" />
        <div className="absolute inset-y-1/2 -translate-y-1/2 h-1 rounded-full bg-primary" style={{ left: `${min}%`, right: `${100 - max}%` }} />
        <input type="range" min="0" max="100" value={min} onChange={(e) => setMin(Math.min(+e.target.value, max - 1))} className="absolute inset-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto" />
        <input type="range" min="0" max="100" value={max} onChange={(e) => setMax(Math.max(+e.target.value, min + 1))} className="absolute inset-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto" />
      </div>
    </div>
  );
}
