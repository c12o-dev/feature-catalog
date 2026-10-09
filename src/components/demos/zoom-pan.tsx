"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ZoomPan() {
  const [s, setS] = useState(1);
  return (
    <div className="space-y-2">
      <div className="rounded-md border bg-muted overflow-hidden h-48 grid place-items-center">
        <div style={{ transform: `scale(${s})`, transition: "transform 0.2s" }} className="text-7xl select-none">🗺️</div>
      </div>
      <div className="flex justify-center gap-1">
        <Button size="sm" variant="outline" onClick={() => setS((s) => Math.max(0.5, s - 0.25))}><ZoomOut className="size-4" /></Button>
        <Button size="sm" variant="outline" onClick={() => setS(1)}><RotateCcw className="size-4" /></Button>
        <Button size="sm" variant="outline" onClick={() => setS((s) => Math.min(3, s + 0.25))}><ZoomIn className="size-4" /></Button>
        <span className="text-xs text-muted-foreground self-center ml-2 tabular-nums">{(s * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
