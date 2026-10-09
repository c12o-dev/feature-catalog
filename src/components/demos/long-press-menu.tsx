"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Pencil, Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const HOLD_MS = 500;
const items = [
  { icon: Copy, label: "コピー" },
  { icon: Pencil, label: "編集" },
  { icon: Share2, label: "共有" },
  { icon: Trash2, label: "削除", danger: true },
];

export default function LongPressMenu() {
  const [open, setOpen] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPressing(false);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();
  }, [open]);

  const openMenu = () => {
    clear();
    setOpen(true);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(10);
  };

  const close = (msg?: string) => {
    setOpen(false);
    if (msg) setStatus(msg);
    triggerRef.current?.focus();
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    const els = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]") ?? []);
    const idx = els.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") els[(idx + 1) % els.length]?.focus();
    else if (e.key === "ArrowUp") els[(idx - 1 + els.length) % els.length]?.focus();
    else if (e.key === "Tab") e.preventDefault();
    else return;
    e.preventDefault();
  };

  return (
    <div className="relative min-h-64 overflow-hidden rounded-lg">
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-4">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-describedby="lpm-hint"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            setPressing(true);
            timer.current = setTimeout(openMenu, HOLD_MS);
          }}
          onPointerUp={clear}
          onPointerLeave={clear}
          onPointerCancel={clear}
          onContextMenu={(e) => {
            e.preventDefault();
            openMenu();
          }}
          onKeyDown={(e) => {
            if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
              e.preventDefault();
              openMenu();
            }
          }}
          className="relative w-full max-w-xs touch-none select-none overflow-hidden rounded-lg border bg-card p-3 text-left shadow-sm outline-none [-webkit-touch-callout:none] focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 origin-left bg-primary/10",
              pressing ? "scale-x-100 transition-transform ease-linear" : "scale-x-0 transition-none",
            )}
            style={{ transitionDuration: pressing ? `${HOLD_MS}ms` : undefined }}
          />
          <span className="relative block text-xs text-muted-foreground">中村 葵 · 10:24</span>
          <span className="relative mt-1 block text-sm">明日の打ち合わせ、資料は共有フォルダに入れておきました。</span>
        </button>
        <p id="lpm-hint" className="text-center text-xs text-muted-foreground">
          メッセージを長押し（キーボードは Shift+F10）
        </p>
        <p className="h-4 text-xs font-medium" aria-live="polite">
          {status}
        </p>
      </div>
      {open && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/30 p-4 backdrop-blur-[1px]" onClick={() => close()}>
          <div
            ref={menuRef}
            role="menu"
            aria-label="メッセージの操作"
            onKeyDown={onMenuKey}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[13rem] rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
          >
            {items.map((m) => (
              <button
                key={m.label}
                type="button"
                role="menuitem"
                onClick={() => close(`「${m.label}」を選択しました`)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent",
                  m.danger && "text-red-600 dark:text-red-400",
                )}
              >
                <m.icon className="size-4" aria-hidden />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
