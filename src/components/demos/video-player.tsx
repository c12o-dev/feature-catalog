"use client";

import { useState } from "react";
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="aspect-video rounded-md bg-zinc-900 relative overflow-hidden text-white">
      <div className="absolute inset-0 grid place-items-center text-zinc-500 text-xs">[ 動画コンテンツ ]</div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 space-y-2">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: "35%" }} /></div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={() => setPlaying((p) => !p)}>{playing ? <Pause className="size-4" /> : <Play className="size-4" />}</button>
          <Volume2 className="size-4" />
          <span className="tabular-nums">1:24 / 4:02</span>
          <div className="ml-auto flex items-center gap-2">
            <Settings className="size-4" /><Maximize className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
