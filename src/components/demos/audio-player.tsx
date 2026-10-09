"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function AudioPlayer() {
  const [p, setP] = useState(false);
  return (
    <div className="rounded-lg border bg-background p-3 max-w-sm flex items-center gap-3">
      <div className="size-14 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">Track Title</div>
        <div className="text-xs text-muted-foreground truncate">Artist Name</div>
        <div className="mt-1 h-1 rounded-full bg-muted"><div className="h-full bg-foreground rounded-full" style={{ width: "30%" }} /></div>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded hover:bg-accent"><SkipBack className="size-4" /></button>
        <button onClick={() => setP((p) => !p)} className="size-9 rounded-full bg-foreground text-background grid place-items-center">{p ? <Pause className="size-4" /> : <Play className="size-4" />}</button>
        <button className="p-1.5 rounded hover:bg-accent"><SkipForward className="size-4" /></button>
      </div>
    </div>
  );
}
