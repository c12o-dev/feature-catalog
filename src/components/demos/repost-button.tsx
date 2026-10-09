"use client";

import { useState } from "react";
import { Repeat2 } from "lucide-react";

export default function RepostButton() {
  const [on, setOn] = useState(false);
  const [n, setN] = useState(48);
  return (
    <div className="flex justify-center">
      <button onClick={() => { setOn(!on); setN((c) => c + (on ? -1 : 1)); }} className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-emerald-500/10 transition-colors">
        <Repeat2 className={`size-5 ${on ? "text-emerald-500" : "text-muted-foreground"}`} />
        <span className={`text-sm tabular-nums ${on ? "text-emerald-500" : ""}`}>{n}</span>
      </button>
    </div>
  );
}
