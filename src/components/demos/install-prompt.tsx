"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallPrompt() {
  const [open, setOpen] = useState(true);
  if (!open) return <button onClick={() => setOpen(true)} className="text-xs text-muted-foreground">バナー再表示</button>;
  return (
    <div className="rounded-lg border bg-background p-3 max-w-md flex items-center gap-3">
      <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 grid place-items-center text-white font-bold">FC</div>
      <div className="flex-1">
        <div className="text-sm font-medium">Feature Catalog をインストール</div>
        <div className="text-xs text-muted-foreground">ホーム画面に追加してアプリのように使えます</div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground"><X className="size-4" /></button>
        <Button size="sm"><Download className="size-3.5" />追加</Button>
      </div>
    </div>
  );
}
