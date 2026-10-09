"use client";

import { useState } from "react";
import { Hexagon, Circle, Square } from "lucide-react";

export default function MapDraw() {
  const [tool, setTool] = useState<"polygon" | "circle" | "rect">("polygon");
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[{ v: "polygon" as const, i: Hexagon }, { v: "circle" as const, i: Circle }, { v: "rect" as const, i: Square }].map((t) => (
          <button key={t.v} onClick={() => setTool(t.v)} className={`size-8 rounded grid place-items-center ${tool === t.v ? "bg-foreground text-background" : "border"}`}>
            <t.i className="size-4" />
          </button>
        ))}
      </div>
      <div className="relative aspect-video rounded-md border bg-emerald-50 dark:bg-emerald-950/30">
        <svg viewBox="0 0 100 60" className="absolute inset-0 size-full">
          {tool === "polygon" && <polygon points="20,40 40,15 70,20 80,45 50,55" fill="hsl(217 91% 60% / 0.3)" stroke="hsl(217 91% 60%)" strokeWidth="1" />}
          {tool === "circle" && <circle cx="50" cy="30" r="20" fill="hsl(217 91% 60% / 0.3)" stroke="hsl(217 91% 60%)" strokeWidth="1" />}
          {tool === "rect" && <rect x="25" y="15" width="50" height="30" fill="hsl(217 91% 60% / 0.3)" stroke="hsl(217 91% 60%)" strokeWidth="1" />}
        </svg>
      </div>
    </div>
  );
}
