"use client";

import { useState } from "react";
import { CheckCheck, GitMerge, HardDrive, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const initial = [
  { id: 1, icon: GitMerge, title: "PR #284 がマージされました", meta: "feature-catalog · 5 分前", read: false },
  { id: 2, icon: MessageSquare, title: "中村さんがコメントしました", meta: "「ヘッダーの余白、8px で統一しませんか」 · 32 分前", read: false },
  { id: 3, icon: FileText, title: "週次レポート（9/22〜9/28）", meta: "昨日", read: true },
  { id: 4, icon: HardDrive, title: "ストレージ使用量が 90% を超えました", meta: "2 日前", read: false },
];

export default function ReadUnread() {
  const [list, setList] = useState(initial);
  const unread = list.filter((x) => !x.read).length;

  const toggle = (id: number) => setList((l) => l.map((x) => (x.id === id ? { ...x, read: !x.read } : x)));

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">通知</span>
          <span className="rounded-full bg-primary px-1.5 text-xs tabular-nums text-primary-foreground" aria-live="polite">
            {unread} 件未読
          </span>
        </div>
        <button
          type="button"
          disabled={unread === 0}
          onClick={() => setList((l) => l.map((x) => ({ ...x, read: true })))}
          className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs text-primary hover:bg-muted disabled:pointer-events-none disabled:text-muted-foreground"
        >
          <CheckCheck className="size-3.5" aria-hidden />
          すべて既読にする
        </button>
      </div>
      <ul className="divide-y">
        {list.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => toggle(it.id)}
                aria-label={`${it.title}（${it.read ? "既読" : "未読"}）。押すと${it.read ? "未読" : "既読"}にします`}
                className={cn("flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-muted/60", !it.read && "bg-primary/[0.04]")}
              >
                <Icon className={cn("mt-0.5 size-4 shrink-0", it.read ? "text-muted-foreground" : "text-foreground")} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-sm", it.read ? "text-muted-foreground" : "font-medium")}>{it.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{it.meta}</span>
                </span>
                <span
                  aria-hidden
                  className={cn("mt-1.5 size-2 shrink-0 rounded-full transition-opacity", it.read ? "opacity-0" : "bg-primary opacity-100")}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
