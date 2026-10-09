"use client";

import { useEffect, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJIS = [
  { e: "👍", label: "いいね" },
  { e: "❤️", label: "ハート" },
  { e: "😂", label: "笑い" },
  { e: "🎉", label: "お祝い" },
  { e: "😮", label: "驚き" },
  { e: "🙏", label: "感謝" },
  { e: "👀", label: "見てます" },
  { e: "🚀", label: "ロケット" },
];
const COLS = 4;

type Reaction = { e: string; count: number; mine: boolean };

export default function ReactionPicker() {
  const [reactions, setReactions] = useState<Reaction[]>([
    { e: "👍", count: 4, mine: false },
    { e: "🎉", count: 2, mine: true },
  ]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemRefs.current[active]?.focus();
  }, [open, active]);

  const toggle = (e: string) => {
    const label = EMOJIS.find((x) => x.e === e)?.label ?? e;
    const cur = reactions.find((r) => r.e === e);
    if (cur?.mine) {
      setReactions(reactions.flatMap((r) => (r.e !== e ? [r] : r.count > 1 ? [{ ...r, count: r.count - 1, mine: false }] : [])));
      setLive(`${label} を取り消しました`);
    } else if (cur) {
      setReactions(reactions.map((r) => (r.e === e ? { ...r, count: r.count + 1, mine: true } : r)));
      setLive(`${label} でリアクションしました`);
    } else {
      setReactions([...reactions, { e, count: 1, mine: true }]);
      setLive(`${label} でリアクションしました`);
    }
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onGridKey = (ev: React.KeyboardEvent) => {
    const n = EMOJIS.length;
    let next = active;
    if (ev.key === "ArrowRight") next = (active + 1) % n;
    else if (ev.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (ev.key === "ArrowDown") next = Math.min(n - 1, active + COLS);
    else if (ev.key === "ArrowUp") next = Math.max(0, active - COLS);
    else if (ev.key === "Home") next = 0;
    else if (ev.key === "End") next = n - 1;
    else if (ev.key === "Escape") {
      ev.preventDefault();
      close();
      return;
    } else return;
    ev.preventDefault();
    setActive(next);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <article className="rounded-lg border bg-card p-4 text-card-foreground">
        <div className="flex items-center gap-2">
          <div aria-hidden className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium">佐</div>
          <div className="min-w-0">
            <p className="text-sm font-medium">佐藤 美咲</p>
            <p className="text-xs text-muted-foreground">#design · 10:24</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed">新しいオンボーディング画面のモックを共有しました。週末までにフィードバックをお願いします！</p>

        <div ref={wrapRef} className="relative mt-3 flex flex-wrap items-center gap-1.5">
          {reactions.map((r) => {
            const label = EMOJIS.find((x) => x.e === r.e)?.label ?? r.e;
            return (
              <button
                key={r.e}
                type="button"
                aria-pressed={r.mine}
                aria-label={`${label} ${r.count} 件${r.mine ? "（自分がリアクション済み）" : ""}`}
                onClick={() => toggle(r.e)}
                className={cn(
                  "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-xs transition-colors",
                  r.mine ? "border-primary/50 bg-primary/10 text-foreground" : "bg-background hover:bg-muted",
                )}
              >
                <span aria-hidden>{r.e}</span>
                <span className="tabular-nums">{r.count}</span>
              </button>
            );
          })}
          <button
            ref={triggerRef}
            type="button"
            aria-label="リアクションを追加"
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="reaction-picker-panel"
            onClick={() => (open ? setOpen(false) : (setActive(0), setOpen(true)))}
            className="inline-flex h-7 items-center rounded-full border border-dashed px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <SmilePlus className="size-4" />
          </button>

          {open && (
            <div
              id="reaction-picker-panel"
              role="dialog"
              aria-label="リアクションを選択"
              className="absolute left-0 top-full z-10 mt-2 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg"
            >
              <div role="grid" aria-label="絵文字" onKeyDown={onGridKey} className="grid grid-cols-4 gap-1">
                {Array.from({ length: Math.ceil(EMOJIS.length / COLS) }, (_, row) => (
                  <div role="row" key={row} className="contents">
                    {EMOJIS.slice(row * COLS, row * COLS + COLS).map((x, j) => {
                      const i = row * COLS + j;
                      const mine = reactions.some((r) => r.e === x.e && r.mine);
                      return (
                        <div role="gridcell" key={x.e}>
                          <button
                            ref={(el) => {
                              itemRefs.current[i] = el;
                            }}
                            type="button"
                            tabIndex={i === active ? 0 : -1}
                            aria-label={x.label}
                            aria-pressed={mine}
                            onClick={() => {
                              toggle(x.e);
                              close();
                            }}
                            onFocus={() => setActive(i)}
                            className={cn(
                              "grid size-9 place-items-center rounded-md text-lg transition-transform hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring motion-safe:hover:scale-110",
                              mine && "bg-primary/10",
                            )}
                          >
                            <span aria-hidden>{x.e}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="mt-2 px-1 text-[11px] text-muted-foreground">矢印キーで移動 · Enter で選択 · Esc で閉じる</p>
            </div>
          )}
        </div>
      </article>
      <p aria-live="polite" className="sr-only">{live}</p>
    </div>
  );
}
