"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function Stepper() {
  const [n, setN] = useState(1);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center rounded-md border bg-background overflow-hidden">
        <button onClick={() => setN((n) => Math.max(0, n - 1))} className="px-3 py-2 hover:bg-accent" disabled={n === 0}><Minus className="size-4" /></button>
        <input type="number" value={n} onChange={(e) => setN(Math.max(0, +e.target.value))} className="w-14 text-center bg-transparent outline-none tabular-nums font-mono" />
        <button onClick={() => setN((n) => n + 1)} className="px-3 py-2 hover:bg-accent"><Plus className="size-4" /></button>
      </div>
      <div className="text-xs text-muted-foreground">数量: {n}</div>
    </div>
  );
}
