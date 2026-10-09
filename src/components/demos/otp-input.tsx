"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LEN = 6;
const VALID = "246810";

export default function OtpInput() {
  const [v, setV] = useState<string[]>(Array(LEN).fill(""));
  const [status, setStatus] = useState<"idle" | "ok" | "ng">("idle");
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const hintId = useId();

  const fill = (start: number, digits: string) => {
    const next = [...v];
    let last = start;
    for (let k = 0; k < digits.length && start + k < LEN; k++) {
      next[start + k] = digits[k];
      last = start + k;
    }
    setV(next);
    setStatus("idle");
    refs.current[Math.min(last + 1, LEN - 1)]?.focus();
    if (next.every(Boolean)) setStatus(next.join("") === VALID ? "ok" : "ng");
  };

  const onChange = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setV((p) => p.map((x, j) => (j === i ? "" : x)));
      setStatus("idle");
      return;
    }
    // SMS autofill (one-time-code) may deliver every digit into one box.
    if (digits.length >= LEN) fill(0, digits);
    else fill(i, digits.slice(-1));
  };

  const onPaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    e.preventDefault();
    fill(digits.length >= LEN ? 0 : i, digits);
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !v[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const reset = () => {
    setV(Array(LEN).fill(""));
    setStatus("idle");
    refs.current[0]?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-3">
      <div>
        <div className="text-sm font-medium">確認コードを入力</div>
        <p id={hintId} className="mt-0.5 text-xs text-muted-foreground">
          090-****-1234 に送信した 6 桁のコード（デモ用: <span className="font-mono">246810</span>）
        </p>
      </div>
      <div role="group" aria-label="確認コード 6 桁" className="flex gap-1.5 sm:gap-2">
        {v.map((ch, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={ch}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            onPaste={(e) => onPaste(i, e)}
            onFocus={(e) => e.currentTarget.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`${i + 1} 桁目`}
            aria-describedby={i === 0 ? hintId : undefined}
            aria-invalid={status === "ng" || undefined}
            className={cn(
              "aspect-square w-full min-w-0 max-w-12 flex-1 rounded-md border bg-background text-center font-mono text-lg tabular-nums outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40",
              status === "ok" && "border-emerald-500 dark:border-emerald-400",
              status === "ng" && "border-destructive",
            )}
          />
        ))}
      </div>
      <div className="flex min-h-7 items-center justify-between gap-2">
        <p aria-live="polite" className="text-xs">
          {status === "ok" && <span className="text-emerald-600 dark:text-emerald-400">認証しました</span>}
          {status === "ng" && <span className="text-destructive">コードが一致しません</span>}
          {status === "idle" && <span className="text-muted-foreground">貼り付けにも対応しています</span>}
        </p>
        <Button variant="ghost" size="sm" onClick={reset}>
          クリア
        </Button>
      </div>
    </div>
  );
}
