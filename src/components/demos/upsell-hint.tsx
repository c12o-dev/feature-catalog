"use client";

import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpsellHint() {
  return (
    <div className="rounded-md border bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-3 max-w-md">
      <div className="flex items-start gap-2">
        <div className="rounded-full bg-purple-500 p-1.5 text-white"><Lock className="size-3" /></div>
        <div className="flex-1">
          <div className="text-sm font-medium flex items-center gap-1.5">高度な分析 <Sparkles className="size-3.5 text-purple-500" /></div>
          <div className="text-xs text-muted-foreground mt-0.5">この機能は <strong>Pro</strong> 以上で利用できます。月額 ¥1,200 から。</div>
          <Button size="xs" className="mt-2">アップグレード</Button>
        </div>
      </div>
    </div>
  );
}
