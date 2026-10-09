"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Megaphone, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: number; date: string; title: string; body: string; tag: "新機能" | "改善" | "修正" };

const items: Item[] = [
  { id: 4, date: "9月30日", title: "ダークモードに対応", body: "設定 > 表示 から切り替えられます。", tag: "新機能" },
  { id: 3, date: "9月26日", title: "API v3 を公開", body: "Webhook の署名検証が追加されました。", tag: "新機能" },
  { id: 2, date: "9月18日", title: "検索が最大 3 倍高速に", body: "インデックスを再構築しました。", tag: "改善" },
  { id: 1, date: "9月12日", title: "CSV 出力の文字化けを修正", body: "Excel で開いても崩れません。", tag: "修正" },
];

const LAST_SEEN_INITIAL = 2; // the user has already read items up to id 2

const tagClass: Record<Item["tag"], string> = {
  新機能: "bg-primary text-primary-foreground",
  改善: "bg-secondary text-secondary-foreground",
  修正: "bg-muted text-muted-foreground",
};

export default function ChangelogPopover() {
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState(LAST_SEEN_INITIAL);
  // ids that were unread when the popover was opened, so they stay highlighted while it is open
  const [fresh, setFresh] = useState<number[]>([]);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const unread = items.filter((it) => it.id > lastSeen).length;

  const openPanel = () => {
    setFresh(items.filter((it) => it.id > lastSeen).map((it) => it.id));
    setLastSeen(items[0].id);
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative min-h-[22rem] w-full">
      <div className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
        <span className="truncate text-sm font-medium">ワークスペース</span>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : openPanel())}
          aria-expanded={open}
          aria-controls={panelId}
          className="relative inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm hover:bg-muted"
        >
          <Megaphone className="size-4" />
          新着情報
          {unread > 0 && (
            <>
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-rose-500 ring-2 ring-background dark:bg-rose-400" />
              <span className="sr-only">（未読 {unread} 件）</span>
            </>
          )}
        </button>
      </div>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="最近の変更"
          className="absolute right-0 top-14 z-10 w-full max-w-80 rounded-lg border bg-popover text-popover-foreground shadow-lg"
        >
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">最近の変更</span>
            <button type="button" onClick={close} aria-label="閉じる" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
          <ul className="max-h-64 divide-y overflow-y-auto">
            {items.map((it) => {
              const isNew = fresh.includes(it.id);
              return (
                <li key={it.id} className={cn("px-3 py-2.5", isNew && "bg-primary/5")}>
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", tagClass[it.tag])}>{it.tag}</span>
                    <span className="text-xs text-muted-foreground">{it.date}</span>
                    {isNew && <span className="ml-auto text-[10px] font-semibold text-rose-600 dark:text-rose-400">NEW</span>}
                  </div>
                  <div className="mt-1 text-sm font-medium">{it.title}</div>
                  <p className="text-xs text-muted-foreground">{it.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span aria-live="polite">{unread ? `未読 ${unread} 件` : "すべて既読"}</span>
        <button
          type="button"
          onClick={() => {
            setLastSeen(LAST_SEEN_INITIAL);
            setFresh([]);
          }}
          className="inline-flex items-center gap-1 rounded px-1.5 py-1 hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          未読に戻す
        </button>
      </div>
    </div>
  );
}
