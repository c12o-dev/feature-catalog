"use client";

import { useEffect, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Reaction = { emoji: string; label: string; count: number; me: boolean };
const initial: Reaction[] = [
  { emoji: "👍", label: "いいね", count: 5, me: true },
  { emoji: "🎉", label: "お祝い", count: 3, me: false },
  { emoji: "❤️", label: "ハート", count: 2, me: false },
];
const palette = [
  { emoji: "👍", label: "いいね" },
  { emoji: "❤️", label: "ハート" },
  { emoji: "😂", label: "笑い" },
  { emoji: "🎉", label: "お祝い" },
  { emoji: "🚀", label: "ロケット" },
  { emoji: "👀", label: "見てます" },
];

export default function EmojiReactions() {
  const [r, setR] = useState(initial);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (emoji: string, label: string) =>
    setR((rs) => {
      const ex = rs.find((x) => x.emoji === emoji);
      if (ex) return rs.map((x) => (x.emoji === emoji ? { ...x, count: x.count + (x.me ? -1 : 1), me: !x.me } : x)).filter((x) => x.count > 0);
      return [...rs, { emoji, label, count: 1, me: true }];
    });

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-full bg-muted text-[11px] font-medium">田中</div>
          <p className="text-sm font-medium">田中 陽太</p>
          <p className="text-xs text-muted-foreground">14:05</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed">ステージング環境へのデプロイが完了しました。動作確認をお願いします 🙏</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5" ref={wrapRef}>
          {r.map((x) => (
            <button
              key={x.emoji}
              type="button"
              onClick={() => toggle(x.emoji, x.label)}
              aria-pressed={x.me}
              aria-label={`${x.label} ${x.count} 件${x.me ? "（自分も追加済み）" : ""}`}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-xs tabular-nums transition-colors",
                x.me ? "border-sky-400/70 bg-sky-500/10 text-sky-700 dark:border-sky-400/50 dark:text-sky-300" : "hover:bg-accent",
              )}
            >
              <span aria-hidden>{x.emoji}</span>
              <span aria-hidden>{x.count}</span>
            </button>
          ))}
          <div className="relative">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="リアクションを追加"
              aria-haspopup="true"
              aria-expanded={open}
              className="grid h-7 w-8 place-items-center rounded-full border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <SmilePlus className="size-3.5" />
            </button>
            {open && (
              <div role="group" aria-label="絵文字を選択" className="absolute left-0 top-full z-10 mt-1 grid grid-cols-6 gap-0.5 rounded-lg border bg-popover p-1 shadow-md">
                {palette.map((p) => {
                  const mine = r.some((x) => x.emoji === p.emoji && x.me);
                  return (
                    <button
                      key={p.emoji}
                      type="button"
                      aria-label={p.label}
                      aria-pressed={mine}
                      onClick={() => {
                        toggle(p.emoji, p.label);
                        setOpen(false);
                        triggerRef.current?.focus();
                      }}
                      className={cn("grid size-8 place-items-center rounded-md text-base hover:bg-accent", mine && "bg-sky-500/10")}
                    >
                      {p.emoji}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
