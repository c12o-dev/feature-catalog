"use client";

import { useState } from "react";

export default function ColorPicker() {
  const [hue, setHue] = useState(217);
  const [sat, setSat] = useState(91);
  const [light, setLight] = useState(60);
  const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#000000"];
  return (
    <div className="space-y-3 max-w-xs">
      <div className="flex items-center gap-3">
        <div className="size-16 rounded-md border" style={{ background: `hsl(${hue} ${sat}% ${light}%)` }} />
        <code className="text-xs">hsl({hue}, {sat}%, {light}%)</code>
      </div>
      <div>
        <label className="text-[10px] text-muted-foreground">Hue</label>
        <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(+e.target.value)} className="w-full" style={{ background: "linear-gradient(to right, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))" }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground">Sat {sat}%</label>
          <input type="range" min="0" max="100" value={sat} onChange={(e) => setSat(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Light {light}%</label>
          <input type="range" min="0" max="100" value={light} onChange={(e) => setLight(+e.target.value)} className="w-full" />
        </div>
      </div>
      <div className="flex gap-1.5">
        {palette.map((c) => (
          <button key={c} onClick={() => { /* parse */ }} className="size-6 rounded-md border" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}
