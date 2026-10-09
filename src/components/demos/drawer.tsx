"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bell, FolderKanban, Home, LogOut, Menu, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: Home, label: "ホーム" },
  { icon: FolderKanban, label: "プロジェクト" },
  { icon: Bell, label: "通知" },
  { icon: Settings, label: "設定" },
];

export default function Drawer() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("ホーム");
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg border bg-background">
      <header className="flex items-center gap-2 border-b bg-card px-2 py-2">
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="メニューを開く"
          aria-expanded={open}
          aria-haspopup="dialog"
          className="grid size-8 place-items-center rounded-md hover:bg-muted"
        >
          <Menu className="size-4" />
        </button>
        <span className="text-sm font-medium">{page}</span>
      </header>
      <div className="space-y-2 p-4" aria-hidden={open}>
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-2 w-full rounded bg-muted/70" />
        <div className="h-2 w-5/6 rounded bg-muted/70" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-16 rounded-md bg-muted/60" />
          <div className="h-16 rounded-md bg-muted/60" />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="absolute inset-0 bg-black/40"
              onClick={close}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden
            />
            <motion.div
              key="panel"
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="absolute inset-y-0 left-0 flex w-[min(16rem,80%)] flex-col border-r bg-popover text-popover-foreground shadow-xl"
              initial={reduce ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { x: "-100%", transition: { duration: 0 } } : { x: "-100%" }}
              transition={{ type: "tween", duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-center justify-between border-b px-3 py-2.5">
                <span id={titleId} className="text-sm font-medium">
                  メニュー
                </span>
                <button type="button" onClick={close} aria-label="メニューを閉じる" className="grid size-7 place-items-center rounded-md hover:bg-muted">
                  <X className="size-4" />
                </button>
              </div>
              <nav className="flex-1 space-y-0.5 p-2" aria-label="メイン">
                {ITEMS.map((it) => (
                  <button
                    key={it.label}
                    type="button"
                    onClick={() => {
                      setPage(it.label);
                      close();
                    }}
                    aria-current={page === it.label ? "page" : undefined}
                    className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted", page === it.label && "bg-muted font-medium")}
                  >
                    <it.icon className="size-4" aria-hidden />
                    {it.label}
                  </button>
                ))}
              </nav>
              <div className="border-t p-2">
                <button type="button" onClick={close} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted">
                  <LogOut className="size-4" aria-hidden />
                  ログアウト
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
