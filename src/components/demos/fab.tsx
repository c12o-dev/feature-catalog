"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera, FileText, ListTodo, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { id: "note", label: "メモ", icon: FileText },
  { id: "task", label: "タスク", icon: ListTodo },
  { id: "photo", label: "写真", icon: Camera },
];

const initialItems = [
  { id: 1, text: "週次ミーティングの議事録" },
  { id: 2, text: "デザインレビューの準備" },
  { id: 3, text: "経費精算 (9 月分)" },
];

export default function Fab() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(4);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const add = (label: string) => {
    const id = nextId.current++;
    setItems((prev) => [{ id, text: `新しい${label}` }, ...prev].slice(0, 5));
    setStatus(`${label}を追加しました`);
    setOpen(false);
  };

  return (
    <div className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-lg border bg-background">
      <div className="border-b px-4 py-2.5 text-sm font-medium">ホーム</div>
      <ul className="divide-y">
        {items.map((t) => (
          <li key={t.id} className="px-4 py-2.5 text-sm">
            {t.text}
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
      {open && <div aria-hidden className="absolute inset-0 bg-background/60" />}
      <div ref={wrapRef} className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
        {open && (
          <ul id={menuId} className="flex flex-col items-end gap-2">
            {actions.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => add(a.label)}
                  className="flex items-center gap-2 rounded-full border bg-popover py-1.5 pr-1.5 pl-3 text-sm text-popover-foreground shadow-sm hover:bg-muted"
                >
                  {a.label}
                  <span className="grid size-7 place-items-center rounded-full bg-muted">
                    <a.icon className="size-3.5" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          aria-label={open ? "作成メニューを閉じる" : "新規作成"}
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen((v) => !v)}
          className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className={cn("size-5 transition-transform duration-200", open && "rotate-45")} aria-hidden />
        </button>
      </div>
    </div>
  );
}
