"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Bell, CheckCheck, GitPullRequest, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: number; icon: typeof Bell; who: string; what: string; time: string; unread: boolean };

const initial: Item[] = [
  { id: 1, icon: GitPullRequest, who: "佐藤 美咲", what: "が PR #284 のレビューを依頼しました", time: "5 分前", unread: true },
  { id: 2, icon: MessageSquare, who: "高橋 蓮", what: "がコメント:「この方針で進めましょう」", time: "1 時間前", unread: true },
  { id: 3, icon: AlertCircle, who: "システム", what: "ストレージ使用量が 80% を超えました", time: "3 時間前", unread: true },
  { id: 4, icon: GitPullRequest, who: "伊藤 結衣", what: "が PR #281 をマージしました", time: "昨日", unread: false },
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initial);
  const bellRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const unread = items.filter((i) => i.unread).length;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        bellRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    bellRef.current?.focus();
  };

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-lg border bg-background">
      <header className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-sm font-semibold">ダッシュボード</span>
        <button
          ref={bellRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={`通知を開く${unread ? `（未読 ${unread} 件）` : ""}`}
          aria-expanded={open}
          aria-controls="nc-drawer"
          className="relative grid size-9 place-items-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums">
              {unread}
            </span>
          )}
        </button>
      </header>
      <div className="space-y-2 p-4" aria-hidden={open}>
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-16 rounded-md bg-muted" />
          <div className="h-16 rounded-md bg-muted" />
        </div>
        <p className="pt-2 text-xs text-muted-foreground">右上のベルから通知ドロワーを開けます。</p>
      </div>

      {open && <button type="button" tabIndex={-1} aria-label="閉じる" onClick={close} className="absolute inset-0 z-10 bg-black/30" />}
      <aside
        id="nc-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="通知"
        inert={!open}
        className={cn(
          "absolute inset-y-0 right-0 z-20 flex w-[88%] max-w-sm flex-col border-l bg-popover text-popover-foreground shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <span className="text-sm font-semibold">通知</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setItems((xs) => xs.map((x) => ({ ...x, unread: false })))}
              disabled={unread === 0}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:bg-muted disabled:text-muted-foreground disabled:hover:bg-transparent"
            >
              <CheckCheck className="size-3.5" />
              すべて既読
            </button>
            <button ref={closeRef} type="button" onClick={close} aria-label="通知を閉じる" className="grid size-7 place-items-center rounded-md hover:bg-muted">
              <X className="size-4" />
            </button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">未読 {unread} 件</p>
        <ul className="flex-1 divide-y overflow-y-auto">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, unread: false } : x)))}
                className={cn("flex w-full items-start gap-3 px-3 py-3 text-left text-sm hover:bg-muted/60", it.unread && "bg-primary/5")}
              >
                <it.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block">
                    <span className="font-medium">{it.who}</span> <span className="text-muted-foreground">{it.what}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{it.time}</span>
                </span>
                {it.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="未読" />}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
