"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PushPermission() {
  const [state, setState] = useState<"default" | "granted" | "denied">("default");
  return (
    <div className="rounded-md border bg-background p-4 max-w-md">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-950 grid place-items-center shrink-0">
          {state === "denied" ? <BellOff className="size-5 text-red-500" /> : <Bell className="size-5 text-blue-500" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">通知を有効にしますか？</div>
          <div className="text-xs text-muted-foreground mt-0.5">重要なアクティビティとメンションをお届けします</div>
          {state === "default" && (
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="ghost" onClick={() => setState("denied")}>後で</Button>
              <Button size="sm" onClick={() => setState("granted")}>有効にする</Button>
            </div>
          )}
          {state === "granted" && <div className="text-xs text-emerald-600 mt-2">✓ 通知を許可しました</div>}
          {state === "denied" && <div className="text-xs text-muted-foreground mt-2">通知はオフです</div>}
        </div>
      </div>
    </div>
  );
}
