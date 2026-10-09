"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Download, NotebookPen, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Phase = "banner" | "dialog" | "installing" | "installed" | "dismissed";

const APP = { name: "つむぎノート", host: "tsumugi.example" };

function AppIcon({ size = "size-10" }: { size?: string }) {
  return (
    <div aria-hidden className={`${size} grid shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm`}>
      <NotebookPen className="size-1/2" />
    </div>
  );
}

export default function InstallPrompt() {
  const [phase, setPhase] = useState<Phase>("banner");
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (phase === "dialog") dialogRef.current?.querySelector<HTMLButtonElement>("[data-primary]")?.focus();
  }, [phase]);

  const install = () => {
    setPhase("installing");
    timer.current = setTimeout(() => {
      setPhase("installed");
      setMsg(`${APP.name} をホーム画面に追加しました`);
    }, 1200);
  };
  const reset = () => {
    clearTimeout(timer.current);
    setPhase("banner");
    setMsg("");
  };

  return (
    <div className="relative mx-auto min-h-[280px] w-full max-w-md overflow-hidden rounded-lg border bg-muted/40">
      {/* ブラウザ風の上部バー */}
      <div className="flex items-center gap-2 border-b bg-background px-3 py-2">
        <div className="flex-1 truncate rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{APP.host}/today</div>
        {phase === "installed" && <span className="text-xs text-emerald-700 dark:text-emerald-400">アプリで開けます</span>}
      </div>

      {/* ページ本文のダミー */}
      <div aria-hidden className="space-y-2 p-4">
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-2 w-full rounded bg-muted" />
        <div className="h-2 w-5/6 rounded bg-muted" />
        <div className="h-2 w-2/3 rounded bg-muted" />
      </div>

      {(phase === "banner" || phase === "installing") && (
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg animate-in fade-in-0 slide-in-from-bottom-2">
          <AppIcon />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{APP.name} をインストール</div>
            <div className="text-xs text-muted-foreground">ホーム画面から 1 タップで開けます</div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="インストールの案内を閉じる"
              onClick={() => {
                setPhase("dismissed");
                setMsg("案内を閉じました。7 日間は表示しません");
              }}
              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden className="size-4" />
            </button>
            <Button size="sm" disabled={phase === "installing"} onClick={() => setPhase("dialog")}>
              <Download aria-hidden />
              {phase === "installing" ? "追加中…" : "追加"}
            </Button>
          </div>
        </div>
      )}

      {phase === "dialog" && (
        <div className="absolute inset-0 grid place-items-center bg-black/40 p-4 animate-in fade-in-0">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={(e) => e.key === "Escape" && setPhase("banner")}
            className="w-full max-w-xs rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl animate-in zoom-in-95"
          >
            <div className="flex items-center gap-3">
              <AppIcon size="size-12" />
              <div className="min-w-0">
                <h3 id={titleId} className="text-sm font-semibold">
                  アプリをインストールしますか？
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {APP.name} · {APP.host}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setPhase("banner")}>
                キャンセル
              </Button>
              <Button size="sm" data-primary onClick={install}>
                インストール
              </Button>
            </div>
          </div>
        </div>
      )}

      {(phase === "installed" || phase === "dismissed") && (
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-popover p-3 text-sm text-popover-foreground shadow-sm">
          <span className="flex items-center gap-2">
            {phase === "installed" ? (
              <Check aria-hidden className="size-4 text-emerald-600 dark:text-emerald-400" />
            ) : null}
            {phase === "installed" ? "インストール済み" : "案内を非表示中"}
          </span>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw aria-hidden />
            もう一度
          </Button>
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {msg}
      </p>
    </div>
  );
}
