"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECRET = "build";
const TAPS = 5;

const INFO: [string, string][] = [
  ["バージョン", "2.8.1"],
  ["コミット", "a3f2e9c"],
  ["ブランチ", "main"],
  ["ビルド日時", "2026-10-01 08:42 JST"],
  ["環境", "production"],
  ["ランタイム", "Node 22.16.0"],
];

export default function BuildInfoModal() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [taps, setTaps] = useState(0);
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const versionRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  const reveal = () => {
    setOpen(true);
    setTaps(0);
    setTyped("");
  };

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => versionRef.current?.focus());
  };

  const tap = () => {
    const n = taps + 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (n >= TAPS) {
      reveal();
      return;
    }
    setTaps(n);
    tapTimer.current = setTimeout(() => setTaps(0), 1500);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (open) {
      if (e.key === "Escape") close();
      return;
    }
    if (e.nativeEvent.isComposing || e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
    const next = (typed + e.key.toLowerCase()).slice(-SECRET.length);
    if (next === SECRET) reveal();
    else setTyped(next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INFO.map(([k, v]) => `${k}: ${v}`).join("\n"));
    } catch {
      /* ignore — feedback below still confirms intent */
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const left = TAPS - taps;

  return (
    <div
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="relative mx-auto min-h-[340px] max-w-md overflow-hidden rounded-lg border bg-card outline-none"
    >
      <div className="space-y-1 border-b px-4 py-3">
        <div className="text-sm font-medium">このアプリについて</div>
        <div className="text-xs text-muted-foreground">Lumen for Teams</div>
      </div>
      <ul className="divide-y text-sm">
        <li className="flex items-center justify-between px-4 py-2.5">
          <span>利用規約</span>
          <span className="text-xs text-muted-foreground">›</span>
        </li>
        <li className="flex items-center justify-between px-4 py-2.5">
          <span>プライバシーポリシー</span>
          <span className="text-xs text-muted-foreground">›</span>
        </li>
        <li>
          <button
            ref={versionRef}
            type="button"
            onClick={tap}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-muted/50"
          >
            <span>バージョン</span>
            <span className="text-xs text-muted-foreground tabular-nums">2.8.1</span>
          </button>
        </li>
      </ul>
      <p className="px-4 pt-3 text-xs text-muted-foreground" aria-live="polite">
        {taps > 0 ? (
          <span className="tabular-nums">あと {left} 回で開発者情報を表示します</span>
        ) : (
          <>
            ヒント: バージョンを {TAPS} 回タップするか、ここをクリックしてから
            <kbd className="mx-1 rounded border bg-muted px-1 font-mono text-[10px]">b u i l d</kbd>
            と入力
          </>
        )}
      </p>

      {open && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 p-4 motion-safe:animate-in motion-safe:fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-xs rounded-lg border bg-popover p-4 text-popover-foreground shadow-xl outline-none motion-safe:animate-in motion-safe:zoom-in-95"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 id={titleId} className="flex items-center gap-1.5 text-sm font-semibold">
                <Terminal className="size-4" aria-hidden />
                ビルド情報
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label="閉じる"
                className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
              {INFO.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="break-all font-mono">{v}</dd>
                </div>
              ))}
            </dl>
            <Button size="sm" variant="outline" className="mt-4 w-full" onClick={copy}>
              {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              {copied ? "コピーしました" : "情報をコピー"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
