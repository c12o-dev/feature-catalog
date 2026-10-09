"use client";

import { useEffect, useRef, useState } from "react";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { keys: ["⌘", "K"], desc: "コマンドパレット" },
  { keys: ["⌘", "P"], desc: "ファイルを開く" },
  { keys: ["⌘", "/"], desc: "コメント切替" },
  { keys: ["⌘", "S"], desc: "保存" },
  { keys: ["?"], desc: "このヘルプを表示" },
];

function isEditable(t: EventTarget | null) {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT";
}

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.isComposing || isEditable(e.target)) return;
      if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, []);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="relative flex min-h-72 flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border bg-card p-4">
      <Button ref={triggerRef} size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Keyboard className="size-4" aria-hidden />
        ショートカット一覧
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">?</kbd> キーでも開きます
      </p>
      <label className="w-full max-w-xs space-y-1 text-xs text-muted-foreground">
        <span>メモ（入力中の「?」では開きません）</span>
        <input
          type="text"
          placeholder="例: 次回の議題は?"
          className="h-8 w-full rounded-md border bg-background px-2 text-sm text-foreground"
        />
      </label>

      {open && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-4" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-help-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 id="shortcuts-help-title" className="text-sm font-semibold">
                キーボードショートカット
              </h3>
              <button
                ref={closeRef}
                type="button"
                aria-label="閉じる"
                onClick={close}
                className="rounded p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <ul className="space-y-2">
              {shortcuts.map((s) => (
                <li key={s.desc} className="flex items-center justify-between gap-2 text-sm">
                  <span>{s.desc}</span>
                  <span className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
