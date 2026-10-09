"use client";

import { useState } from "react";

export default function SeekThumbnail() {
  const [hov, setHov] = useState<number | null>(null);
  const colors = ["from-blue-400 to-cyan-400", "from-emerald-400 to-lime-400", "from-amber-400 to-rose-400", "from-purple-400 to-pink-400", "from-indigo-400 to-blue-400"];
  return (
    <div className="space-y-2">
      <div
        className="relative h-2 rounded-full bg-muted cursor-pointer"
        onMouseMove={(e) => {
          const r = (e.target as HTMLDivElement).getBoundingClientRect();
          setHov(((e.clientX - r.left) / r.width) * 100);
        }}
        onMouseLeave={() => setHov(null)}
      >
        <div className="absolute inset-y-0 left-0 bg-red-500 rounded-full" style={{ width: "40%" }} />
        {hov !== null && (
          <div className="absolute -top-20 -translate-x-1/2 w-24 aspect-video rounded border-2 border-white shadow-lg overflow-hidden" style={{ left: `${hov}%` }}>
            <div className={`size-full bg-gradient-to-br ${colors[Math.floor(hov / 20)]}`} />
            <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] text-center py-0.5 tabular-nums">
              {Math.floor((hov / 100) * 240 / 60)}:{(Math.floor((hov / 100) * 240) % 60).toString().padStart(2, "0")}
            </div>
          </div>
        )}
      </div>
      <div className="text-xs text-muted-foreground text-center">バーに hover してプレビュー</div>
    </div>
  );
}
