"use client";

import { useState } from "react";

export default function CursorFollower() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <div
      onMouseMove={(e) => {
        const r = (e.target as HTMLDivElement).getBoundingClientRect();
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      className="relative rounded-md border bg-background h-40 overflow-hidden cursor-none"
    >
      <div className="absolute size-12 rounded-full bg-blue-500/20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
      <div className="absolute size-3 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
      <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground pointer-events-none">マウスを動かしてみる</div>
    </div>
  );
}
