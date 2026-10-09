"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;
const JST = 9 * 3_600_000;
const NOW = new Date("2026-10-01T09:00:00+09:00").getTime();
const TRIAL_START = new Date("2026-09-24T00:00:00+09:00").getTime();
const TRIAL_DAYS = 14;
const TRIAL_END = TRIAL_START + TRIAL_DAYS * DAY; // exclusive: 2026-10-08 00:00 JST

// Calendar days left in JST (end date counts as the first day you no longer have access).
function daysLeft(now: number) {
  const dayIndex = (t: number) => Math.floor((t + JST) / DAY);
  return Math.max(0, dayIndex(TRIAL_END) - dayIndex(now));
}
// Format in JST without reading the viewer's timezone.
function fmtDate(t: number) {
  const d = new Date(t + JST);
  const w = "日月火水木金土"[d.getUTCDay()];
  return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日（${w}）`;
}

export default function TrialCounter() {
  const [offset, setOffset] = useState(0); // demo: days advanced
  const now = NOW + offset * DAY;
  const left = daysLeft(now);
  const lastDay = TRIAL_END - DAY;
  const tone = left === 0 ? "expired" : left <= 3 ? "urgent" : "normal";

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div
        className={cn(
          "rounded-lg border p-3",
          tone === "normal" && "bg-card",
          tone === "urgent" && "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",
          tone === "expired" && "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/50",
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Clock
            className={cn(
              "size-5 shrink-0",
              tone === "normal" && "text-muted-foreground",
              tone === "urgent" && "text-amber-600 dark:text-amber-400",
              tone === "expired" && "text-red-600 dark:text-red-400",
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1 text-sm" role="status">
            <div className="font-medium">
              {left > 0 ? (
                <>
                  無料トライアル残り <span className="tabular-nums">{left} 日</span>
                </>
              ) : (
                "無料トライアルが終了しました"
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {left > 0 ? `${fmtDate(lastDay)}まで Pro 機能を使えます` : "データは 30 日間保持されます"}
            </div>
          </div>
          <Button size="sm" variant={tone === "normal" ? "outline" : "default"}>
            {left > 0 ? "プランを選ぶ" : "アップグレード"}
          </Button>
        </div>
        <div className="mt-3 flex gap-0.5" aria-hidden>
          {Array.from({ length: TRIAL_DAYS }, (_, i) => (
            <span
              key={i}
              className={cn("h-1.5 flex-1 rounded-full", i < TRIAL_DAYS - left ? "bg-muted-foreground/25" : tone === "urgent" ? "bg-amber-500" : "bg-foreground/70")}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">今日: {fmtDate(now)}</span>
        <div className="flex gap-1">
          <Button size="xs" variant="ghost" onClick={() => setOffset(0)} disabled={offset === 0}>
            戻す
          </Button>
          <Button size="xs" variant="outline" onClick={() => setOffset((o) => o + 2)} disabled={left === 0}>
            2 日進める
          </Button>
        </div>
      </div>
    </div>
  );
}
