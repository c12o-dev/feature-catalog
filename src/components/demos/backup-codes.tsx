"use client";

import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const codes = ["x4k2-9pmL", "h7nQ-3vBd", "r8sT-pK4w", "j9mD-2hYx", "n3qV-fW8c", "b6gK-5rPa", "e2tH-jL9m", "y4nB-8wQr"];

export default function BackupCodes() {
  return (
    <div className="rounded-md border bg-background p-3 max-w-md space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">バックアップコード</div>
        <Button size="xs" variant="ghost"><RefreshCw className="size-3" />再生成</Button>
      </div>
      <div className="text-xs text-muted-foreground">2 段階認証デバイスを失った時に使用</div>
      <div className="grid grid-cols-2 gap-1.5 font-mono text-sm">
        {codes.map((c) => <div key={c} className="rounded bg-muted px-2 py-1 tabular-nums">{c}</div>)}
      </div>
      <Button size="sm" variant="outline" className="w-full"><Download className="size-3.5" />ダウンロード</Button>
    </div>
  );
}
