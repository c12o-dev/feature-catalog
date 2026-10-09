"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

function Bar({ label, className }: { label: string; className?: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-busy="true" className={cn("relative h-1 overflow-hidden rounded-full bg-muted", className)}>
      {/* reduced motion: a static, softly tinted full bar. Otherwise a sliding segment (transform only). */}
      <div className="absolute inset-0 bg-primary/40 motion-safe:hidden" />
      <div className="absolute inset-y-0 left-0 hidden w-2/5 rounded-full bg-primary will-change-transform motion-safe:block motion-safe:animate-[ib-slide_1.4s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
    </div>
  );
}

export default function IndeterminateBar() {
  const [syncing, setSyncing] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    setSyncing(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSyncing(false), 4000);
  };

  useEffect(() => {
    timer.current = setTimeout(() => setSyncing(false), 4000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <style>{`@keyframes ib-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }`}</style>

      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
        <div className="h-1">{syncing && <Bar label="受信トレイを同期中" className="rounded-none" />}</div>
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">受信トレイ</p>
            <p aria-live="polite" className="text-xs text-muted-foreground">
              {syncing ? "サーバーと同期しています…（完了時間は不明）" : "同期が完了しました · 新着 3 件"}
            </p>
          </div>
          <button
            type="button"
            onClick={start}
            disabled={syncing}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw aria-hidden className="size-3.5" />
            再同期
          </button>
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">バックアップを準備中</span>
          <span className="text-muted-foreground">残り時間を計算中</span>
        </div>
        <Bar label="バックアップを準備中" />
      </div>
    </div>
  );
}
