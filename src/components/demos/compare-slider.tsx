"use client";

import { useState } from "react";

export default function CompareSlider() {
  const [v, setV] = useState(50);
  return (
    <div className="space-y-2">
      <div className="relative aspect-[16/9] rounded-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-300 to-zinc-500 grid place-items-center text-zinc-700 text-sm font-semibold">Before</div>
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${v}%` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 grid place-items-center text-white text-sm font-semibold" style={{ width: `${10000 / v}%` }}>After</div>
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md" style={{ left: `${v}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-7 rounded-full bg-white grid place-items-center text-xs font-semibold shadow-md">⇔</div>
        </div>
      </div>
      <input type="range" min="0" max="100" value={v} onChange={(e) => setV(+e.target.value)} className="w-full" />
    </div>
  );
}
