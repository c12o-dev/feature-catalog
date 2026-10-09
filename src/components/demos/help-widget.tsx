"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative h-44 rounded-md border bg-muted/30">
      <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">アプリ画面</div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="absolute bottom-3 right-3 size-12 rounded-full bg-primary text-primary-foreground shadow-lg grid place-items-center hover:scale-105 transition-transform">
          <MessageCircle className="size-5" />
        </button>
      ) : (
        <div className="absolute bottom-3 right-3 w-64 rounded-lg bg-popover border shadow-xl">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="text-sm font-medium">サポート</div>
            <button onClick={() => setOpen(false)}><X className="size-4" /></button>
          </div>
          <div className="p-3 space-y-2 text-sm">
            <div className="rounded-md border p-2 cursor-pointer hover:bg-accent">FAQ を見る</div>
            <div className="rounded-md border p-2 cursor-pointer hover:bg-accent">チャットを開始</div>
          </div>
        </div>
      )}
    </div>
  );
}
