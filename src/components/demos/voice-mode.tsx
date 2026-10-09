"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";

export default function VoiceMode() {
  const [active, setActive] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(8));
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setBars(() => Array.from({ length: 20 }, () => 6 + Math.random() * 32)), 120);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => setActive((a) => !a)}
        className={`size-16 rounded-full grid place-items-center transition-colors ${active ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"}`}
      >
        {active ? <Mic className="size-7" /> : <MicOff className="size-7" />}
      </button>
      <div className="flex items-end gap-0.5 h-10">
        {bars.map((h, i) => (
          <div key={i} className={`w-1 rounded-full transition-all duration-100 ${active ? "bg-primary" : "bg-muted"}`} style={{ height: `${active ? h : 8}px` }} />
        ))}
      </div>
      <div className="text-xs text-muted-foreground">{active ? "聞いています..." : "タップで開始"}</div>
    </div>
  );
}
