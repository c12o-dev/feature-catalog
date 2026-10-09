"use client";

import { MapPin } from "lucide-react";

const pins = [
  { x: 30, y: 40, label: "新宿" }, { x: 50, y: 50, label: "渋谷" }, { x: 65, y: 45, label: "東京駅" }, { x: 45, y: 30, label: "池袋" },
];

export default function MapMarkers() {
  return (
    <div className="relative aspect-video rounded-md border overflow-hidden bg-emerald-50 dark:bg-emerald-950/30">
      <svg viewBox="0 0 100 60" className="absolute inset-0 size-full">
        <path d="M0 30 Q 25 10, 50 30 T 100 30 V60 H0 Z" fill="hsl(217 91% 60% / 0.15)" />
      </svg>
      {pins.map((p) => (
        <div key={p.label} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <MapPin className="size-5 text-red-500 fill-red-500/30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 rounded bg-popover border text-[10px] px-1.5 py-0.5 whitespace-nowrap">{p.label}</div>
        </div>
      ))}
    </div>
  );
}
