"use client";

import { Heart, MessageCircle, Share, Music } from "lucide-react";

export default function ReelFeed() {
  return (
    <div className="aspect-[9/16] max-w-[180px] mx-auto rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 relative overflow-hidden">
      <div className="absolute inset-0 grid place-items-center text-white text-xs">縦動画 9:16</div>
      <div className="absolute right-2 bottom-12 flex flex-col gap-3 items-center text-white">
        <button><Heart className="size-5" /><div className="text-[9px] tabular-nums">12.3K</div></button>
        <button><MessageCircle className="size-5" /><div className="text-[9px] tabular-nums">284</div></button>
        <button><Share className="size-5" /></button>
      </div>
      <div className="absolute left-2 right-12 bottom-2 text-white text-xs">
        <div className="font-semibold mb-1">@creator</div>
        <div className="opacity-90 line-clamp-2">アプリの新機能紹介。コメント欄で感想ください #shorts</div>
        <div className="flex items-center gap-1 mt-1 opacity-80"><Music className="size-3" />Original audio</div>
      </div>
    </div>
  );
}
