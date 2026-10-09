"use client";

import { Mail, X } from "lucide-react";
import { useState } from "react";

export default function RenewalReminder() {
  const [open, setOpen] = useState(true);
  if (!open) return <button onClick={() => setOpen(true)} className="text-xs text-muted-foreground">バナー再表示</button>;
  return (
    <div className="rounded-md border bg-background p-3 max-w-md">
      <div className="flex items-start gap-3">
        <Mail className="size-4 text-blue-500 mt-0.5 shrink-0" />
        <div className="flex-1 text-sm">
          <div className="font-medium">3 日後に自動更新されます</div>
          <div className="text-xs text-muted-foreground mt-0.5">2026-04-29 にカード ****1234 から ¥1,200 が請求されます</div>
        </div>
        <button onClick={() => setOpen(false)} className="text-muted-foreground"><X className="size-3.5" /></button>
      </div>
    </div>
  );
}
