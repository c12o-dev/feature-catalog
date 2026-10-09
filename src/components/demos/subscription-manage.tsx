"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionManage() {
  return (
    <div className="rounded-lg border bg-background p-4 max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">現在のプラン</div>
          <div className="text-lg font-semibold">Pro</div>
        </div>
        <Badge>Active</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><div className="text-xs text-muted-foreground">料金</div><div>¥1,200 / 月</div></div>
        <div><div className="text-xs text-muted-foreground">次回請求</div><div>2026-05-15</div></div>
      </div>
      <div className="flex gap-2 pt-2 border-t">
        <Button size="sm" variant="outline">プラン変更</Button>
        <Button size="sm" variant="ghost" className="text-destructive">解約</Button>
      </div>
    </div>
  );
}
