"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <div className="text-center">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Cookie className="size-4" />
          バナーを再表示
        </Button>
      </div>
    );
  }
  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Cookie className="size-5 mt-0.5 text-amber-500 shrink-0" />
        <div className="flex-1 text-sm">
          <div className="font-medium mb-1">Cookie の使用について</div>
          <p className="text-muted-foreground text-xs">
            このサイトは利用状況の分析と機能向上のため Cookie を使用します。
          </p>
        </div>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="閉じる">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex gap-2 mt-3 justify-end">
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>必須のみ</Button>
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>カスタマイズ</Button>
        <Button size="sm" onClick={() => setOpen(false)}>すべて許可</Button>
      </div>
    </div>
  );
}
