"use client";

import { useRef, useState } from "react";
import { GripVertical, Inbox, CalendarDays, Clock, Archive, Star, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string; count: number; icon: LucideIcon };

const INITIAL: Item[] = [
  { id: "inbox", label: "受信トレイ", count: 12, icon: Inbox },
  { id: "star", label: "スター付き", count: 4, icon: Star },
  { id: "week", label: "今週", count: 7, icon: CalendarDays },
  { id: "later", label: "あとで読む", count: 23, icon: Clock },
  { id: "archive", label: "アーカイブ", count: 318, icon: Archive },
];

function move<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [m] = copy.splice(from, 1);
  copy.splice(to, 0, m);
  return copy;
}

export default function SortableList() {
  const [items, setItems] = useState(INITIAL);
  const [dragging, setDragging] = useState<number | null>(null);
  const [gap, setGap] = useState<number | null>(null); // insertion gap index 0..n
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  const gapFromY = (y: number) => {
    for (let i = 0; i < items.length; i++) {
      const r = rows.current[i]?.getBoundingClientRect();
      if (r && y < r.top + r.height / 2) return i;
    }
    return items.length;
  };

  const onPointerDown = (i: number) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(i);
    setGap(i);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging === null) return;
    setGap(gapFromY(e.clientY));
  };
  const onPointerUp = () => {
    if (dragging !== null && gap !== null) {
      const to = gap > dragging ? gap - 1 : gap;
      if (to !== dragging) {
        setItems(move(items, dragging, to));
        setMsg(`${items[dragging].label} を ${to + 1} 番目に移動しました`);
      }
    }
    setDragging(null);
    setGap(null);
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    const it = items[i];
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (grabbed) {
        setGrabbed(null);
        setMsg(`${it.label} を ${i + 1} 番目に置きました`);
      } else {
        setGrabbed(it.id);
        setMsg(`${it.label} を持ち上げました。上下キーで移動、スペースで確定`);
      }
    } else if (grabbed === it.id && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const to = e.key === "ArrowUp" ? i - 1 : i + 1;
      if (to < 0 || to >= items.length) return;
      setItems(move(items, i, to));
      setMsg(`${to + 1} / ${items.length} 番目`);
      requestAnimationFrame(() => rows.current[to]?.querySelector("button")?.focus());
    } else if (e.key === "Escape" && grabbed) {
      setGrabbed(null);
      setMsg("移動を終了しました");
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-2">
      <p className="text-xs text-muted-foreground">ハンドルをドラッグ、またはフォーカスしてスペース → ↑↓ で並び替え</p>
      <ul className="relative rounded-lg border bg-card p-1" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        {items.map((it, i) => {
          const Icon = it.icon;
          const isDrag = dragging === i;
          const isGrab = grabbed === it.id;
          return (
            <li key={it.id} ref={(el) => { rows.current[i] = el; }} className="relative">
              {gap === i && dragging !== null && gap !== dragging && gap !== dragging + 1 && (
                <span aria-hidden className="absolute -top-px right-2 left-2 z-10 h-0.5 rounded-full bg-primary before:absolute before:-top-[3px] before:-left-1 before:size-2 before:rounded-full before:bg-primary" />
              )}
              <div
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-[opacity,background-color]",
                  isDrag && "bg-muted opacity-50",
                  isGrab && "bg-primary/10 ring-1 ring-primary",
                )}
              >
                <button
                  type="button"
                  aria-label={`${it.label} を並び替え`}
                  aria-pressed={isGrab}
                  onPointerDown={onPointerDown(i)}
                  onKeyDown={onKeyDown(i)}
                  onBlur={(e) => { if (isGrab && e.relatedTarget) setGrabbed(null); }}
                  className="grid size-6 touch-none cursor-grab place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                >
                  <GripVertical className="size-4" aria-hidden />
                </button>
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                <span className="flex-1">{it.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{it.count}</span>
              </div>
              {i === items.length - 1 && gap === items.length && dragging !== null && dragging !== items.length - 1 && (
                <span aria-hidden className="absolute right-2 -bottom-px left-2 z-10 h-0.5 rounded-full bg-primary" />
              )}
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="sr-only">{msg}</p>
    </div>
  );
}
