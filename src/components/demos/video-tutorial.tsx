"use client";

import { Play } from "lucide-react";

export default function VideoTutorial() {
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-xs text-muted-foreground">埋め込みチュートリアル動画</div>
      <div className="aspect-video rounded-md bg-zinc-900 relative grid place-items-center cursor-pointer hover:bg-zinc-800">
        <div className="size-12 rounded-full bg-white/10 backdrop-blur grid place-items-center"><Play className="size-5 text-white fill-white ml-0.5" /></div>
        <div className="absolute bottom-2 left-2 text-white text-xs">3:42</div>
      </div>
    </div>
  );
}
