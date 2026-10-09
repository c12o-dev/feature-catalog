"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function BannerAlert() {
  const [show, setShow] = useState(true);
  if (!show) return <button onClick={() => setShow(true)} className="text-xs text-muted-foreground">バナーを再表示</button>;
  return (
    <div className="rounded-md bg-amber-100 dark:bg-amber-950/40 border-l-4 border-amber-500 p-3 flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm">
      <AlertTriangle className="size-4" />
      <div className="flex-1">予定された保守作業のため、本日 22:00 〜 23:00 にサービス停止します。</div>
      <button onClick={() => setShow(false)} className="opacity-60 hover:opacity-100"><X className="size-4" /></button>
    </div>
  );
}
