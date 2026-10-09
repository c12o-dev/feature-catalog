"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

export default function BookmarkButton() {
  const [b, setB] = useState(false);
  const [count, setCount] = useState(48);
  return (
    <div className="flex items-center justify-center">
      <button onClick={() => { setB(!b); setCount((c) => c + (b ? -1 : 1)); }} className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-accent transition-colors">
        <Bookmark className={`size-5 transition-colors ${b ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
        <span className="text-sm tabular-nums">{count}</span>
      </button>
    </div>
  );
}
