"use client";

export default function Subtitles() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">動画下部に字幕 (CC)</div>
      <div className="aspect-video bg-black rounded-md relative grid place-items-center">
        <div className="text-zinc-500 text-xs">[動画]</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm max-w-[80%] text-center">
          こんにちは、字幕のサンプルです。
        </div>
      </div>
    </div>
  );
}
