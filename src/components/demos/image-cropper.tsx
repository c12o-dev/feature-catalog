"use client";

import { useState } from "react";

export default function ImageCropper() {
  const [zoom, setZoom] = useState(1.2);
  return (
    <div className="space-y-2 max-w-xs mx-auto">
      <div className="relative size-48 mx-auto rounded-md overflow-hidden bg-zinc-200">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 transition-transform"
          style={{ transform: `scale(${zoom})` }}
        />
        <div className="absolute inset-0 ring-2 ring-white pointer-events-none" />
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border border-white/30" />)}
        </div>
      </div>
      <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(+e.target.value)} className="w-full" />
      <div className="text-xs text-muted-foreground text-center">ズーム: {zoom.toFixed(2)}x</div>
    </div>
  );
}
