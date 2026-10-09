"use client";

import { useEffect, useState } from "react";
import { Eye, Radio } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

// 決定的な視聴者数の増減
const deltas = [12, -4, 9, 17, -6, 3, 21, -9, 6, 14, -2, 8];

export default function LiveBadge() {
  const reduce = useReducedMotion();
  const [live, setLive] = useState(true);
  const [step, setStep] = useState(0);
  const viewers = 1284 + deltas.slice(0, step % (deltas.length + 1)).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (deltas.length + 1)), 800);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div className="mx-auto max-w-sm space-y-3">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-video bg-gradient-to-br from-violet-200 to-sky-200 dark:from-violet-950 dark:to-sky-950">
          <div aria-hidden className="absolute inset-0 grid place-items-center">
            <Radio className="size-10 text-foreground/20" />
          </div>
          <div className="absolute left-2 top-2 flex items-center gap-1.5">
            {live ? (
              <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
                <span className="relative flex size-1.5">
                  {!reduce && <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />}
                  <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                </span>
                LIVE
              </span>
            ) : (
              <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">配信終了</span>
            )}
            {live && (
              <span className="inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] tabular-nums text-white">
                <Eye aria-hidden className="size-3" />
                {viewers.toLocaleString("ja-JP")}
                <span className="sr-only">人が視聴中</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 p-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">週末の手作りパン配信</div>
            <div className="text-xs text-muted-foreground">こむぎ工房 · {live ? "配信中" : "12 分前に終了"}</div>
          </div>
          <Button size="sm" variant={live ? "outline" : "default"} onClick={() => setLive((v) => !v)} className="shrink-0">
            {live ? "配信を終了" : "配信を開始"}
          </Button>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{live ? "ライブ配信中" : "配信は終了しました"}</p>
    </div>
  );
}
