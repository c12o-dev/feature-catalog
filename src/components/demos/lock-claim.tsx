"use client";

import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LockClaim() {
  const [locked, setLocked] = useState<"me" | "other" | null>(null);
  return (
    <div className="space-y-3 max-w-md">
      <div className="rounded-md border bg-background p-4">
        <div className="text-sm font-medium mb-2">設計ドキュメント</div>
        <div className={`flex items-center gap-2 text-xs ${locked === "me" ? "text-emerald-600" : locked === "other" ? "text-amber-600" : "text-muted-foreground"}`}>
          {locked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
          {locked === "me" && "あなたが編集権を取得中"}
          {locked === "other" && "Alice が編集中（5 分前から）"}
          {!locked && "編集権なし"}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setLocked("me")} disabled={locked === "me"}>編集権を取得</Button>
        <Button size="sm" variant="outline" onClick={() => setLocked("other")}>他人の編集をシミュレート</Button>
        <Button size="sm" variant="ghost" onClick={() => setLocked(null)}>解除</Button>
      </div>
    </div>
  );
}
