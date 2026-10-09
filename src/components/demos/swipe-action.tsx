"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mail = { id: number; from: string; subject: string; time: string };

const INITIAL: Mail[] = [
  { id: 1, from: "経理チーム", subject: "9 月分の経費精算について", time: "9:12" },
  { id: 2, from: "田中 美咲", subject: "来週の定例、30 分後ろ倒しできますか", time: "8:47" },
  { id: 3, from: "配送センター", subject: "ご注文の商品を発送しました", time: "昨日" },
  { id: 4, from: "山本 健", subject: "デザインレビューのメモ", time: "昨日" },
];

const REVEAL = 80; // px the row snaps open to
const COMMIT = 0.55; // fraction of width that triggers the action on release

export default function SwipeAction() {
  const [items, setItems] = useState(INITIAL);
  const [open, setOpen] = useState<{ id: number; side: "left" | "right" } | null>(null);
  const [drag, setDrag] = useState<{ id: number; dx: number } | null>(null);
  const [undo, setUndo] = useState<{ mail: Mail; index: number; action: string } | null>(null);
  const start = useRef<{ x: number; y: number; base: number; locked: boolean | null } | null>(null);
  const hintId = useId();
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }, []);

  const act = (id: number, action: "archive" | "delete") => {
    const index = items.findIndex((m) => m.id === id);
    if (index < 0) return;
    setUndo({ mail: items[index], index, action: action === "archive" ? "アーカイブしました" : "削除しました" });
    setItems((xs) => xs.filter((m) => m.id !== id));
    setOpen(null);
    setDrag(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndo(null), 4000);
  };

  const restore = () => {
    if (!undo) return;
    setItems((xs) => {
      const next = [...xs];
      next.splice(undo.index, 0, undo.mail);
      return next;
    });
    setUndo(null);
  };

  const offsetOf = (id: number) => {
    if (drag?.id === id) return drag.dx;
    if (open?.id === id) return open.side === "right" ? REVEAL : -REVEAL;
    return 0;
  };

  const onDown = (e: React.PointerEvent, id: number) => {
    start.current = { x: e.clientX, y: e.clientY, base: offsetOf(id), locked: null };
    if (open && open.id !== id) setOpen(null);
  };
  const onMove = (e: React.PointerEvent, id: number) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (s.locked === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      s.locked = Math.abs(dx) > Math.abs(dy);
      if (s.locked) e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (s.locked) setDrag({ id, dx: s.base + dx });
  };
  const onUp = (e: React.PointerEvent, id: number) => {
    const s = start.current;
    start.current = null;
    if (!s?.locked || !drag) return;
    const width = e.currentTarget.getBoundingClientRect().width;
    const dx = drag.dx;
    setDrag(null);
    if (dx > width * COMMIT) return act(id, "archive");
    if (dx < -width * COMMIT) return act(id, "delete");
    if (dx > REVEAL / 2) setOpen({ id, side: "right" });
    else if (dx < -REVEAL / 2) setOpen({ id, side: "left" });
    else setOpen(null);
  };

  const onKey = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "ArrowLeft") setOpen({ id, side: "left" });
    else if (e.key === "ArrowRight") setOpen({ id, side: "right" });
    else if (e.key === "Escape") setOpen(null);
    else return;
    e.preventDefault();
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <ul className="divide-y overflow-hidden rounded-lg border bg-card" aria-label="受信トレイ">
        {items.map((m) => {
          const dx = offsetOf(m.id);
          const leftOpen = open?.id === m.id && open.side === "left";
          const rightOpen = open?.id === m.id && open.side === "right";
          return (
            <li key={m.id} className="relative overflow-hidden">
              {/* archive (revealed by swiping right) */}
              <div className={cn("absolute inset-y-0 left-0 flex items-center bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950", dx > 0 ? "w-full" : "w-0")}>
                <button
                  type="button"
                  tabIndex={rightOpen ? 0 : -1}
                  aria-hidden={!rightOpen}
                  onClick={() => act(m.id, "archive")}
                  aria-label={`「${m.subject}」をアーカイブ`}
                  className="grid h-full place-items-center px-6"
                  style={{ width: REVEAL }}
                >
                  <Archive className="size-4" />
                </button>
              </div>
              {/* delete (revealed by swiping left) */}
              <div className={cn("absolute inset-y-0 right-0 flex items-center justify-end bg-red-600 text-white dark:bg-red-500 dark:text-red-950", dx < 0 ? "w-full" : "w-0")}>
                <button
                  type="button"
                  tabIndex={leftOpen ? 0 : -1}
                  aria-hidden={!leftOpen}
                  onClick={() => act(m.id, "delete")}
                  aria-label={`「${m.subject}」を削除`}
                  className="grid h-full place-items-center px-6"
                  style={{ width: REVEAL }}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div
                role="group"
                tabIndex={0}
                aria-label={`${m.from}: ${m.subject}`}
                aria-describedby={hintId}
                onPointerDown={(e) => onDown(e, m.id)}
                onPointerMove={(e) => onMove(e, m.id)}
                onPointerUp={(e) => onUp(e, m.id)}
                onPointerCancel={() => {
                  start.current = null;
                  setDrag(null);
                }}
                onKeyDown={(e) => onKey(e, m.id)}
                className={cn(
                  "relative cursor-grab touch-pan-y select-none bg-card px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:cursor-grabbing",
                  drag?.id !== m.id && "transition-transform duration-200 ease-out",
                )}
                style={{ transform: `translateX(${dx}px)` }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">{m.from}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{m.time}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{m.subject}</div>
              </div>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="px-3 py-8 text-center text-xs text-muted-foreground">
            受信トレイは空です
            <button type="button" onClick={() => setItems(INITIAL)} className="ml-2 underline underline-offset-2">
              元に戻す
            </button>
          </li>
        )}
      </ul>
      <p id={hintId} className="mt-2 text-xs text-muted-foreground">右へスワイプでアーカイブ、左へスワイプで削除（大きく振ると即実行。キーボードは左右キー）</p>

      <div aria-live="polite" className="pointer-events-none absolute inset-x-2 bottom-8">
        {undo && (
          <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-md bg-foreground px-3 py-2 text-xs text-background shadow-lg">
            <span className="truncate">{undo.action}</span>
            <button type="button" onClick={restore} className="shrink-0 font-medium underline underline-offset-2">
              取り消す
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
