"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

export default function ProfileCard() {
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const show = (delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 200);
  };

  return (
    <div className="min-h-[240px] rounded-lg border bg-background p-4">
      <div className="flex items-start gap-3">
        <div aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
          結
        </div>
        <div className="min-w-0 flex-1 text-sm leading-relaxed">
          <div className="text-xs text-muted-foreground">伊藤 結衣 · 2 時間前</div>
          <div
            ref={wrapRef}
            className="relative inline"
            onPointerEnter={(e) => {
              if (e.pointerType !== "touch") show(300);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "touch") hide();
            }}
            onFocus={() => show(0)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
            }}
          >
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={open}
              aria-controls="profile-hovercard"
              onClick={() => {
                window.clearTimeout(timer.current);
                setOpen((o) => !o);
              }}
              className="rounded-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            >
              @misaki_sato
            </button>
            {open && (
              <div
                id="profile-hovercard"
                role="dialog"
                aria-label="佐藤 美咲 のプロフィール"
                className="absolute left-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-4rem)] rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-300 to-rose-500 font-semibold text-white">
                    美
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">佐藤 美咲</div>
                    <div className="truncate text-xs text-muted-foreground">@misaki_sato</div>
                  </div>
                  <button
                    type="button"
                    aria-pressed={following}
                    onClick={() => setFollowing((f) => !f)}
                    className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium hover:bg-muted aria-[pressed=false]:border-transparent aria-[pressed=false]:bg-primary aria-[pressed=false]:text-primary-foreground"
                  >
                    {following ? "フォロー中" : "フォロー"}
                  </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">プロダクトデザイナー。デザインシステムとアクセシビリティが好き。</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" aria-hidden /> 福岡
                </div>
                <div className="mt-2 flex gap-4 text-xs tabular-nums">
                  <span>
                    <strong className="font-semibold">284</strong> <span className="text-muted-foreground">フォロー</span>
                  </span>
                  <span>
                    <strong className="font-semibold">{following ? "1,249" : "1,248"}</strong> <span className="text-muted-foreground">フォロワー</span>
                  </span>
                </div>
              </div>
            )}
          </div>{" "}
          さんのデザインレビュー、とても参考になりました。次回のスプリントで取り入れます。
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">名前に hover・フォーカス・タップでプロフィールを表示</p>
    </div>
  );
}
