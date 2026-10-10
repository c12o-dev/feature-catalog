"use client";

import { useEffect, useRef, useState } from "react";
import { Command, LayoutGrid, Sparkles, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";

const points = [
  { icon: LayoutGrid, text: "カテゴリから、動くデモ付きのパターンを探せます" },
  { icon: Command, text: "⌘K でどこからでも検索できます" },
  { icon: SunMoon, text: "各デモはライト／ダークを切り替えて確認できます" },
];

export default function WelcomeModal() {
  const [open, setOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) { if (wasOpen.current) primaryRef.current?.focus(); }
    else if (wasOpen.current) openerRef.current?.focus();
    wasOpen.current = true;
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.stopPropagation(); setOpen(false); return; }
    if (e.key !== "Tab") return;
    const els = dialogRef.current?.querySelectorAll<HTMLElement>("button");
    if (!els || els.length === 0) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // The "home screen" and the overlay share one grid cell, so the demo root grows to fit the dialog
  // (footer buttons included) instead of the overlay escaping an absolutely-positioned box.
  return (
    <div className="relative grid min-h-[380px] overflow-hidden rounded-lg border bg-background text-foreground">
      <div className="col-start-1 row-start-1 grid place-items-center p-4 text-center">
        <div>
          <p className="mb-3 text-xs text-muted-foreground">アプリのホーム画面（背景）</p>
          <Button ref={openerRef} variant="outline" onClick={() => setOpen(true)}>初回起動を再現</Button>
        </div>
      </div>
      {open && (
        <div
          className="z-10 col-start-1 row-start-1 grid place-items-center bg-black/50 p-4 motion-safe:animate-in motion-safe:fade-in dark:bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wm-title"
            aria-describedby="wm-desc"
            onKeyDown={onKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border bg-card p-5 text-card-foreground shadow-lg motion-safe:animate-in motion-safe:zoom-in-95"
          >
            <div className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-primary/10">
              <Sparkles className="size-5 text-primary" aria-hidden />
            </div>
            <h2 id="wm-title" className="text-center text-base font-semibold">Feature Catalog へようこそ</h2>
            <p id="wm-desc" className="mt-1 text-center text-sm text-muted-foreground">
              モダン Web の「ユーザーから見える機能」を、動くデモで確かめられるカタログです。
            </p>
            <ul className="mt-4 space-y-2">
              {points.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>後で</Button>
              <Button ref={primaryRef} onClick={() => setOpen(false)}>始める</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
