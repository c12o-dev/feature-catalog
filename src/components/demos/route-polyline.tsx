"use client";

import { MapPin, Flag } from "lucide-react";

export default function RoutePolyline() {
  return (
    <div className="relative aspect-video rounded-md border bg-emerald-50 dark:bg-emerald-950/30 overflow-hidden">
      <svg viewBox="0 0 100 60" className="absolute inset-0 size-full">
        <path d="M 15 50 Q 30 20, 50 30 T 85 15" stroke="hsl(217 91% 60%)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
      <div className="absolute" style={{ left: "10%", top: "75%" }}><MapPin className="size-5 text-emerald-600 fill-emerald-500/40" /></div>
      <div className="absolute" style={{ left: "82%", top: "15%" }}><Flag className="size-5 text-rose-600 fill-rose-500/40" /></div>
      <div className="absolute bottom-2 left-2 right-2 rounded bg-background/90 px-2 py-1 text-xs flex justify-between">
        <span>距離 8.4km</span><span>所要時間 24 分</span>
      </div>
    </div>
  );
}
