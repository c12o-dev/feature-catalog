"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

const VALUE = "sk-proj-9JxkZ3qP4vHmN7fWcL2bR8tA";
// Fixed-length mask so the real length is not revealed; keep the last 4 chars as a hint.
const MASKED = `sk-••••••••••••${VALUE.slice(-4)}`;

export default function MaskedField() {
  const id = useId();
  const [shown, setShown] = useState(false);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const flash = (s: "copied" | "failed") => {
    setStatus(s);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1800);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(VALUE);
      flash("copied");
    } catch {
      flash("failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-1.5">
      <p id={`${id}-label`} className="text-sm font-medium">
        API キー
      </p>
      <div className="flex items-center gap-1 rounded-md border bg-background pl-3">
        <code aria-labelledby={`${id}-label`} className="min-w-0 flex-1 truncate font-mono text-sm tracking-wide">
          {shown ? VALUE : <>
              <span aria-hidden>{MASKED}</span>
              <span className="sr-only">非表示中（末尾 {VALUE.slice(-4)}）</span>
            </>}
        </code>
        <button type="button" onClick={() => setShown((s) => !s)} aria-pressed={shown} className="rounded p-2 text-muted-foreground hover:text-foreground" aria-label={shown ? "キーを隠す" : "キーを表示"}>
          {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
        <button type="button" onClick={copy} className="rounded p-2 text-muted-foreground hover:text-foreground" aria-label="キーをコピー">
          {status === "copied" ? <Check className="size-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-4" />}
        </button>
      </div>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {status === "copied" ? "クリップボードにコピーしました" : status === "failed" ? "コピーできませんでした。表示して手動でコピーしてください" : "この値は他人に見せないでください"}
      </p>
    </div>
  );
}
