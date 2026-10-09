"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RenewalReminder() {
  const [open, setOpen] = useState(true);
  const [autoRenew, setAutoRenew] = useState(true);

  if (!open) {
    return (
      <div className="mx-auto w-full max-w-md">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          リマインドを再表示
        </Button>
      </div>
    );
  }

  return (
    <div role="region" aria-label="自動更新のお知らせ" className="mx-auto w-full max-w-md rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Mail className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 text-sm" aria-live="polite">
          {autoRenew ? (
            <>
              <div className="font-medium">3 日後に自動更新されます</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                2026-10-04 にカード ****1234 から Pro プラン ¥1,200 が請求されます。
              </div>
            </>
          ) : (
            <>
              <div className="font-medium">自動更新を停止しました</div>
              <div className="mt-0.5 text-xs text-muted-foreground">2026-10-04 以降は Free プランに切り替わります。</div>
            </>
          )}
        </div>
        <button
          type="button"
          aria-label="お知らせを閉じる"
          onClick={() => setOpen(false)}
          className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-2 pl-11">
        <Button variant="ghost" size="sm" onClick={() => setAutoRenew((v) => !v)}>
          {autoRenew ? "自動更新を停止" : "自動更新を再開"}
        </Button>
        <Button size="sm" onClick={() => setOpen(false)}>
          確認しました
        </Button>
      </div>
    </div>
  );
}
