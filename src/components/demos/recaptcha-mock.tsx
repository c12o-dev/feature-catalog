"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "idle" | "verifying" | "done";

export default function RecaptchaMock() {
  const [state, setState] = useState<State>("idle");
  const [sent, setSent] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const verify = () => {
    if (state !== "idle") return;
    setState("verifying");
    timer.current = setTimeout(() => setState("done"), 1100);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setState("idle");
    setSent(false);
  };

  return (
    <div className="mx-auto w-full max-w-xs space-y-3">
      <form
        className="space-y-3 rounded-lg border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (state === "done") setSent(true);
        }}
      >
        <div className="text-sm font-medium">お問い合わせ</div>
        <div className="space-y-1">
          <label htmlFor="captcha-msg" className="text-xs font-medium">
            内容
          </label>
          <textarea
            id="captcha-msg"
            rows={2}
            defaultValue="料金プランについて相談したいです。"
            className="block w-full resize-none rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>

        <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={state === "done"}
            aria-busy={state === "verifying"}
            aria-label="私はロボットではありません"
            onClick={verify}
            className={cn(
              "grid size-6 shrink-0 place-items-center rounded border-2 bg-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              state === "done" && "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500",
              state === "verifying" && "border-transparent",
            )}
          >
            {state === "verifying" && <Loader2 className="size-5 text-muted-foreground motion-safe:animate-spin" aria-hidden />}
            {state === "done" && <Check className="size-4" strokeWidth={3} aria-hidden />}
          </button>
          <span className="min-w-0 flex-1 text-sm" aria-hidden>
            私はロボットではありません
          </span>
          <div className="flex shrink-0 flex-col items-center text-muted-foreground">
            <ShieldCheck className="size-5" aria-hidden />
            <span className="text-[9px] leading-tight">ボット対策</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={state !== "done" || sent}
          className="h-8 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {sent ? "送信しました" : "送信"}
        </button>
      </form>

      <div className="flex items-center justify-between gap-2">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {state === "idle" && "チェックすると送信できます"}
          {state === "verifying" && "確認しています…"}
          {state === "done" && (sent ? "送信が完了しました" : "確認できました")}
        </p>
        {state !== "idle" && (
          <button type="button" onClick={reset} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
            やり直す
          </button>
        )}
      </div>
    </div>
  );
}
