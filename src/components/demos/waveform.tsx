"use client";

import { useState } from "react";

const bars = Array.from({ length: 60 }, (_, i) => 20 + Math.abs(Math.sin(i / 4) * 30 + Math.cos(i / 3) * 20));

export default function Waveform() {
  const [pos, setPos] = useState(40);
  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-px h-16 cursor-pointer"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos(Math.round(((e.clientX - r.left) / r.width) * 100));
        }}
      >
        {bars.map((h, i) => {
          const played = (i / bars.length) * 100 < pos;
          return <div key={i} className={`w-1 rounded-full ${played ? "bg-foreground" : "bg-muted-foreground/40"}`} style={{ height: h }} />;
        })}
      </div>
      <div className="text-xs text-muted-foreground text-center tabular-nums">{Math.round((pos / 100) * 280 / 60)}:{Math.round((pos / 100) * 280) % 60} / 4:40</div>
    </div>
  );
}
