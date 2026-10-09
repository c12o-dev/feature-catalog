"use client";

import { useState } from "react";

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PlaybackSpeed() {
  const [v, setV] = useState(1);
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {speeds.map((s) => (
        <button key={s} onClick={() => setV(s)} className={`rounded-md px-3 py-1.5 text-sm tabular-nums ${v === s ? "bg-foreground text-background" : "border hover:bg-accent"}`}>
          {s}×
        </button>
      ))}
    </div>
  );
}
