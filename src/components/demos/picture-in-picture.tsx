"use client";

import { useState } from "react";
import { PictureInPicture2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PictureInPicture() {
  const [pip, setPip] = useState(false);
  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" onClick={() => setPip((p) => !p)}>
        <PictureInPicture2 className="size-4" />{pip ? "PiP 解除" : "PiP モード"}
      </Button>
      <div className="aspect-video rounded-md bg-zinc-900 relative overflow-hidden grid place-items-center text-zinc-500 text-xs">
        {pip ? "[ メインコンテンツ (動画は浮上中) ]" : "[ 動画 ]"}
        {pip && (
          <div className="absolute bottom-3 right-3 w-32 aspect-video rounded-md bg-zinc-700 border-2 border-white/20 grid place-items-center shadow-lg">
            <div className="text-zinc-300 text-[10px]">PiP 動画</div>
            <button onClick={() => setPip(false)} className="absolute top-1 right-1 text-white"><X className="size-3" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
