"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrialCounter() {
  return (
    <div className="rounded-md border bg-amber-50 dark:bg-amber-950/30 p-3 max-w-md">
      <div className="flex items-center gap-3">
        <Clock className="size-5 text-amber-500 shrink-0" />
        <div className="flex-1 text-sm">
          <div className="font-medium">無料トライアル残り <span className="tabular-nums">7 日</span></div>
          <div className="text-xs text-muted-foreground">2026-05-03 までに plan 選択が必要</div>
        </div>
        <Button size="sm">プラン選択</Button>
      </div>
    </div>
  );
}
