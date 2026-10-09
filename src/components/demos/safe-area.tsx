"use client";

export default function SafeArea() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">iPhone のノッチ・ホームバー対応 (env(safe-area-inset-*))</div>
      <div className="relative max-w-[200px] mx-auto h-72 rounded-3xl bg-zinc-950 p-1.5">
        <div className="relative h-full rounded-2xl bg-background overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-zinc-950 rounded-b-xl" />
          <div className="pt-7 px-3 text-xs">
            <div className="font-medium">アプリ UI</div>
            <div className="text-muted-foreground mt-1">ノッチを避けて safe area 内に配置</div>
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-foreground/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
