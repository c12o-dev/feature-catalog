"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-sky-400";

export default function FocusRing() {
  const [on, setOn] = useState(true);
  const [notify, setNotify] = useState(true);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">Tab</kbd> でフォーカスを移動してください
        </p>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} className="accent-sky-600" />
          リングを表示
        </label>
      </div>

      <div className={cn("space-y-3 rounded-lg border bg-card p-4", !on && "[&_*]:ring-0! [&_*]:ring-offset-0!")}>
        <label className="block space-y-1">
          <span className="text-xs text-muted-foreground">表示名</span>
          <input
            defaultValue="山田 葵"
            className={cn("h-9 w-full rounded-md border bg-background px-3 text-sm", ring)}
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            className={cn("size-4 rounded accent-sky-600", ring)}
          />
          メールで通知を受け取る
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={cn("rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground", ring)}>
            保存
          </button>
          <button type="button" className={cn("rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted", ring)}>
            キャンセル
          </button>
          <a
            href="#focus-ring-help"
            onClick={(e) => e.preventDefault()}
            className={cn("ml-auto rounded-sm px-0.5 text-sm text-sky-700 underline underline-offset-4 dark:text-sky-400", ring)}
          >
            ヘルプ
          </a>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        マウスでクリックしたときはリングを出さず、キーボード操作時だけ <code className="font-mono">:focus-visible</code> で表示します。
      </p>
    </div>
  );
}
