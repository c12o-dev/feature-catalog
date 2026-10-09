"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECRET = "tR7#qL2v-Wm9!zKp";
const TTL = 15;

type Status = "idle" | "copied" | "cleared" | "failed";

export default function TimedClipboard() {
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(0);
  const [reveal, setReveal] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => stop, []);

  const clearClipboard = async () => {
    stop();
    try {
      await navigator.clipboard.writeText("");
    } catch {
      /* 権限がない環境でも表示上は消去済みにする */
    }
    setRemaining(0);
    setStatus("cleared");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SECRET);
    } catch {
      setStatus("failed");
      return;
    }
    stop();
    const deadline = performance.now() + TTL * 1000;
    setRemaining(TTL);
    setStatus("copied");
    timer.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
      setRemaining(left);
      if (left === 0) void clearClipboard();
    }, 250);
  };

  const pct = status === "copied" ? (remaining / TTL) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-sm space-y-3 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-muted">
          <KeyRound className="size-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">社内 VPN</div>
          <div className="truncate text-xs text-muted-foreground">sato.haruka@example.jp</div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <span className="min-w-0 flex-1 truncate font-mono text-sm tracking-wider" aria-label="パスワード">
          {reveal ? SECRET : "•".repeat(SECRET.length)}
        </span>
        <button
          type="button"
          onClick={() => setReveal((r) => !r)}
          aria-label={reveal ? "パスワードを隠す" : "パスワードを表示"}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={copy}>
          {status === "copied" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {status === "copied" ? "もう一度コピー" : "コピー"}
        </Button>
        {status === "copied" && (
          <Button size="sm" variant="outline" onClick={() => void clearClipboard()}>
            今すぐ消去
          </Button>
        )}
      </div>

      <div aria-live="polite" className="min-h-9 space-y-1.5">
        {status === "copied" && (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-700 dark:text-amber-400">クリップボードから自動消去されます</span>
              <span className="tabular-nums text-muted-foreground">{remaining} 秒</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full origin-left bg-amber-500 transition-transform duration-300 ease-linear dark:bg-amber-400"
                style={{ transform: `scaleX(${pct / 100})` }}
              />
            </div>
          </>
        )}
        {status === "cleared" && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            クリップボードを消去しました
          </p>
        )}
        {status === "failed" && <p className="text-xs text-destructive">コピーできませんでした。ブラウザの権限を確認してください。</p>}
      </div>
    </div>
  );
}
