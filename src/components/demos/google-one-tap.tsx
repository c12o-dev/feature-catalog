"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

type Phase = "prompt" | "loading" | "done" | "dismissed";

const accounts = [
  { name: "青木 葵", email: "aoi.aoki@example.com", initial: "葵", color: "bg-sky-600" },
  { name: "青木 葵（仕事）", email: "aoki@kumo-example.dev", initial: "葵", color: "bg-violet-600" },
];

export default function GoogleOneTap() {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [acc, setAcc] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const proceed = () => {
    setPhase("loading");
    timer.current = setTimeout(() => setPhase("done"), 1000);
  };
  const reset = () => { if (timer.current) clearTimeout(timer.current); setPhase("prompt"); };
  const a = accounts[acc];

  return (
    <div className="relative min-h-72 overflow-hidden rounded-lg border bg-muted/40">
      <header className="flex items-center justify-between border-b bg-background px-3 py-2">
        <span className="text-sm font-semibold">はなまる書店</span>
        {phase === "done" ? (
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`grid size-6 place-items-center rounded-full text-[10px] font-medium text-white ${a.color}`}>{a.initial}</span>
            <span className="hidden sm:inline">{a.name}</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">ログイン</span>
        )}
      </header>
      <div className="space-y-2 p-4" aria-hidden>
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-20 rounded-md bg-muted" />
      </div>

      <div aria-live="polite" className="sr-only">
        {phase === "loading" ? "ログイン中" : phase === "done" ? `${a.name} としてログインしました` : ""}
      </div>

      {(phase === "prompt" || phase === "loading") && (
        <div role="dialog" aria-labelledby="onetap-title" className="absolute inset-x-2 top-12 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg sm:left-auto sm:right-3 sm:w-80">
          <div className="flex items-start justify-between gap-2">
            <p id="onetap-title" className="text-xs text-muted-foreground">
              Google アカウントで <span className="font-medium text-foreground">はなまる書店</span> にログイン
            </p>
            <button type="button" aria-label="閉じる" onClick={() => setPhase("dismissed")} className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent">
              <X aria-hidden className="size-3.5" />
            </button>
          </div>
          <div role="radiogroup" aria-label="アカウント" className="mt-2 space-y-1">
            {accounts.map((x, i) => (
              <button
                key={x.email}
                type="button"
                role="radio"
                aria-checked={acc === i}
                disabled={phase === "loading"}
                onClick={() => setAcc(i)}
                className="flex w-full items-center gap-2.5 rounded-md border border-transparent p-1.5 text-left hover:bg-accent aria-checked:border-border aria-checked:bg-accent/60"
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium text-white ${x.color}`}>{x.initial}</span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium">{x.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{x.email}</span>
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={proceed} disabled={phase === "loading"} className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-70">
            {phase === "loading" ? <><Loader2 aria-hidden className="size-3.5 motion-safe:animate-spin" />ログイン中…</> : `${a.name.split("（")[0]} として続行`}
          </button>
          <p className="mt-2 text-[10px] leading-snug text-muted-foreground">続行すると、名前・メールアドレス・プロフィール画像がこのサイトと共有されます。</p>
        </div>
      )}

      {(phase === "done" || phase === "dismissed") && (
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-xs">
          <span className="flex min-w-0 items-center gap-1.5">
            {phase === "done" && <Check aria-hidden className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />}
            <span className="truncate">{phase === "done" ? `${a.email} でログインしました` : "プロンプトを閉じました"}</span>
          </span>
          <button type="button" onClick={reset} className="shrink-0 text-primary hover:underline">もう一度</button>
        </div>
      )}
    </div>
  );
}
