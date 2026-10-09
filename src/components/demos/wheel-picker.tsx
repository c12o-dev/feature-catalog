"use client";

import { useState } from "react";

export default function WheelPicker() {
  const [h, setH] = useState(14);
  const around = [-2, -1, 0, 1, 2].map((d) => (h + d + 24) % 24);
  return (
    <div className="space-y-2 max-w-xs mx-auto">
      <div className="text-xs text-muted-foreground text-center">時刻を選ぶ (iOS picker 風)</div>
      <div className="rounded-md border bg-background overflow-hidden h-40 relative grid place-items-center">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-muted/40 pointer-events-none" />
        <div className="text-center">
          {around.map((v, i) => (
            <div
              key={i}
              className={`tabular-nums font-mono py-1 transition-all ${i === 2 ? "text-xl" : i === 1 || i === 3 ? "text-base text-muted-foreground" : "text-xs text-muted-foreground/60"}`}
            >
              {v.toString().padStart(2, "0")}
            </div>
          ))}
        </div>
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button onClick={() => setH((h) => (h + 23) % 24)} className="size-6 rounded border text-xs">▲</button>
          <button onClick={() => setH((h) => (h + 1) % 24)} className="size-6 rounded border text-xs">▼</button>
        </div>
      </div>
    </div>
  );
}
