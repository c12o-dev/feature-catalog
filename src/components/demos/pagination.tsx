"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
  const total = 12;
  const [p, setP] = useState(1);
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const window: (number | "...")[] = [];
  if (total <= 7) window.push(...pages);
  else {
    window.push(1);
    if (p > 4) window.push("...");
    for (let i = Math.max(2, p - 1); i <= Math.min(total - 1, p + 1); i++) window.push(i);
    if (p < total - 3) window.push("...");
    window.push(total);
  }
  return (
    <div className="flex items-center justify-center gap-1">
      <button onClick={() => setP((p) => Math.max(1, p - 1))} disabled={p === 1} className="rounded-md border p-1.5 disabled:opacity-40"><ChevronLeft className="size-3.5" /></button>
      {window.map((x, i) =>
        x === "..." ? <span key={i} className="px-2 text-muted-foreground">…</span> : (
          <button key={i} onClick={() => setP(x as number)} className={`size-7 rounded-md text-sm tabular-nums ${p === x ? "bg-foreground text-background" : "border hover:bg-accent"}`}>{x}</button>
        )
      )}
      <button onClick={() => setP((p) => Math.min(total, p + 1))} disabled={p === total} className="rounded-md border p-1.5 disabled:opacity-40"><ChevronRight className="size-3.5" /></button>
    </div>
  );
}
