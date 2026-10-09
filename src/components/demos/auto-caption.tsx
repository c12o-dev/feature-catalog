"use client";

import { Sparkles } from "lucide-react";

export default function AutoCaption() {
  return (
    <div className="space-y-2">
      <div className="aspect-video bg-black rounded-md relative grid place-items-center">
        <div className="text-zinc-500 text-xs">[ 動画 ]</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm max-w-[80%] text-center">
          そして次のステップに進みます
        </div>
        <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded bg-blue-500/90 text-white text-[10px] px-1.5 py-0.5">
          <Sparkles className="size-2.5" />AI 字幕
        </div>
      </div>
    </div>
  );
}
