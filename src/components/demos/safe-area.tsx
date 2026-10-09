"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/*
 * 実機では env(safe-area-inset-*) が端末ごとの値を返す（viewport-fit=cover が必要）。
 * このモックでは端末の値を --sim-* で代わりに与え、max() で env() と合成している。
 */
const SIM = { top: "40px", bottom: "22px" } as const;

export default function SafeArea() {
  const [on, setOn] = useState(true);

  const pad = (side: "top" | "bottom", base: string) =>
    on ? `max(${base}, env(safe-area-inset-${side}, 0px), var(--sim-${side}))` : base;

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-center gap-2 text-sm">
        <Switch checked={on} onCheckedChange={setOn} aria-label="safe area に対応" />
        safe area に対応
      </label>
      <div
        className="relative mx-auto h-80 w-full max-w-[210px] rounded-[2rem] bg-zinc-900 p-1.5 shadow-md dark:bg-zinc-700"
        style={{ "--sim-top": SIM.top, "--sim-bottom": SIM.bottom } as React.CSSProperties}
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-background">
          <div aria-hidden className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-700" />
          <header className="border-b bg-card px-3 pb-2 text-sm font-semibold transition-[padding]" style={{ paddingTop: pad("top", "8px") }}>
            受信トレイ
          </header>
          <ul className="flex-1 space-y-1.5 overflow-hidden px-3 py-2 text-xs">
            {["週次レポート", "請求書のご案内", "ミーティング招待", "新しいコメント"].map((t) => (
              <li key={t} className="rounded-md bg-muted px-2 py-1.5">{t}</li>
            ))}
          </ul>
          <nav className="grid grid-cols-3 border-t bg-card px-2 pt-2 text-center text-[10px] transition-[padding]" style={{ paddingBottom: pad("bottom", "6px") }}>
            <span className="font-medium text-primary">ホーム</span>
            <span className="text-muted-foreground">検索</span>
            <span className="text-muted-foreground">設定</span>
          </nav>
          <div aria-hidden className="absolute bottom-1.5 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-foreground/50" />
        </div>
      </div>
      <pre tabIndex={0} role="region" aria-label="safe-area の CSS" className={cn("focus-visible:outline-2 focus-visible:outline-ring mx-auto max-w-sm overflow-x-auto rounded-md border bg-muted p-2 text-[11px] leading-relaxed", !on && "opacity-50")}>
        <code>{`padding-top: max(8px, env(safe-area-inset-top));
padding-bottom: max(6px, env(safe-area-inset-bottom));`}</code>
      </pre>
      <p aria-live="polite" className="text-center text-xs text-muted-foreground">
        {on ? "ノッチとホームバーを避けて余白を確保" : "見出しがノッチに、タブがホームバーに重なる"}
      </p>
    </div>
  );
}
