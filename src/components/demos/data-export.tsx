"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataExport() {
  const [s, setS] = useState<"idle" | "preparing" | "ready">("idle");
  const start = () => { setS("preparing"); setTimeout(() => setS("ready"), 1500); };
  return (
    <div className="rounded-md border bg-background p-4 max-w-md space-y-3">
      <div>
        <div className="text-sm font-medium">データのエクスポート</div>
        <div className="text-xs text-muted-foreground mt-0.5">あなたの全データ (プロフィール / 投稿 / 設定) を ZIP でダウンロードできます (GDPR / 個情法対応)</div>
      </div>
      {s === "idle" && <Button size="sm" onClick={start}>エクスポートを準備</Button>}
      {s === "preparing" && <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Loader2 className="size-3 animate-spin" />準備中... 完了後メールで通知</div>}
      {s === "ready" && <Button size="sm"><Download className="size-3.5" />my-data-2026-04-27.zip (12.4 MB)</Button>}
    </div>
  );
}
