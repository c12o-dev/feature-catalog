"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronUp, Copy, GitCommitHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const BUILD = {
  version: "1.4.2",
  commit: "a3f2e9c",
  commitFull: "a3f2e9c71b04d5e8f6a2c9b0d1e47f3a85c6b210",
  branch: "main",
  builtAt: "2026-10-01 09:00 JST",
  env: "production",
  runtime: "Node 22.11",
};

const CHANGES = ["検索結果の並び順を修正", "CSV 書き出しの文字化けを解消", "設定画面の読み込みを高速化"];

export default function VersionFooter() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"ok" | "fail" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const text = `v${BUILD.version} (${BUILD.commit}) · ${BUILD.env} · built ${BUILD.builtAt}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="relative mx-auto flex min-h-[320px] w-full max-w-xl flex-col overflow-hidden rounded-lg border bg-background">
      {/* アプリ本文のダミー */}
      <div aria-hidden className="flex-1 space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-2 w-full rounded bg-muted" />
        <div className="h-2 w-4/5 rounded bg-muted" />
      </div>

      {open && (
        <div
          id={panelId}
          className="absolute inset-x-2 bottom-12 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg animate-in fade-in-0 slide-in-from-bottom-1"
        >
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            <dt className="text-muted-foreground">バージョン</dt>
            <dd className="font-mono tabular-nums">v{BUILD.version}</dd>
            <dt className="text-muted-foreground">コミット</dt>
            <dd className="truncate font-mono" title={BUILD.commitFull}>
              {BUILD.commitFull.slice(0, 12)}…
            </dd>
            <dt className="text-muted-foreground">ブランチ</dt>
            <dd className="font-mono">{BUILD.branch}</dd>
            <dt className="text-muted-foreground">ビルド</dt>
            <dd className="font-mono tabular-nums">{BUILD.builtAt}</dd>
            <dt className="text-muted-foreground">実行環境</dt>
            <dd className="font-mono">{BUILD.runtime}</dd>
          </dl>
          <div className="mt-2 border-t pt-2">
            <div className="text-xs font-medium">このバージョンの変更</div>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
              {CHANGES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={copy}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs hover:bg-muted"
          >
            {copied === "ok" ? <Check aria-hidden className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy aria-hidden className="size-3.5" />}
            {copied === "ok" ? "コピーしました" : copied === "fail" ? "コピーできませんでした" : "不具合報告用にコピー"}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied === "ok" ? "バージョン情報をコピーしました" : copied === "fail" ? "コピーできませんでした" : ""}
          </span>
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <span>© 2026 Hinata Works</span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-400">
            <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
            {BUILD.env}
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            aria-label={`バージョン v${BUILD.version}（コミット ${BUILD.commit}）。詳細を${open ? "閉じる" : "表示"}`}
            onClick={() => setOpen((v) => !v)}
            className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono tabular-nums hover:bg-muted hover:text-foreground", open && "bg-muted text-foreground")}
          >
            v{BUILD.version}
            <span className="inline-flex items-center gap-0.5">
              (<GitCommitHorizontal aria-hidden className="size-3" />
              {BUILD.commit})
            </span>
            <ChevronUp aria-hidden className={cn("size-3 transition-transform", !open && "rotate-180")} />
          </button>
        </div>
      </footer>
    </div>
  );
}
