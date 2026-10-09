"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";

export default function BannerAlert() {
  const [show, setShow] = useState(true);

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background">
      {show && (
        <div
          role="region"
          aria-label="お知らせ"
          className="flex items-start gap-2 border-b border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <p className="min-w-0 flex-1 text-xs leading-relaxed">
            10月3日（土）22:00〜23:00 にメンテナンスのためサービスを停止します。
            <a href="#maintenance" onClick={(e) => e.preventDefault()} className="ml-1 font-medium underline underline-offset-2">
              詳細
            </a>
          </p>
          <button
            type="button"
            onClick={() => setShow(false)}
            aria-label="お知らせを閉じる"
            className="grid size-6 shrink-0 place-items-center rounded text-amber-800 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between border-b bg-card px-3 py-2">
        <span className="text-sm font-medium">ダッシュボード</span>
        <span className="size-6 rounded-full bg-muted" aria-hidden />
      </div>
      <div className="space-y-2 p-4">
        <div className="grid grid-cols-3 gap-2">
          {["売上", "注文", "訪問"].map((k, i) => (
            <div key={k} className="rounded-md border bg-card p-2">
              <div className="text-[10px] text-muted-foreground">{k}</div>
              <div className="text-sm font-medium tabular-nums">{["¥1.2M", "384", "9,210"][i]}</div>
            </div>
          ))}
        </div>
        {!show && (
          <button type="button" onClick={() => setShow(true)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw className="size-3" aria-hidden />
            お知らせを再表示
          </button>
        )}
      </div>
    </div>
  );
}
