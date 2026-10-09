"use client";

import { useState } from "react";
import { Moon } from "lucide-react";

const opts = [10, 20, 30, 60, 90];

export default function SleepTimer() {
  const [v, setV] = useState<number | null>(30);
  return (
    <div className="space-y-3 max-w-sm">
      <div className="text-sm font-medium flex items-center gap-1.5"><Moon className="size-4" />スリープタイマー</div>
      <div className="flex flex-wrap gap-1.5">
        {opts.map((o) => (
          <button key={o} onClick={() => setV(o)} className={`rounded-md border px-3 py-1.5 text-sm ${v === o ? "bg-foreground text-background" : ""}`}>{o} 分後</button>
        ))}
        <button onClick={() => setV(null)} className={`rounded-md border px-3 py-1.5 text-sm ${v === null ? "bg-foreground text-background" : ""}`}>OFF</button>
      </div>
      {v && <div className="text-xs text-muted-foreground">{v} 分後に再生を停止します</div>}
    </div>
  );
}
