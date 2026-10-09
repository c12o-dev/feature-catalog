"use client";

import { Compass } from "lucide-react";

export default function StreetView() {
  return (
    <div className="relative aspect-video rounded-md border bg-gradient-to-b from-blue-300 via-emerald-200 to-zinc-400 overflow-hidden">
      <div className="absolute inset-0 grid place-items-center text-white/80 text-sm">[ 360° street view ]</div>
      <div className="absolute bottom-2 right-2 rounded-full bg-background/90 p-2"><Compass className="size-4" /></div>
    </div>
  );
}
