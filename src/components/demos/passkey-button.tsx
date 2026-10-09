"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Fingerprint, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "prompt" | "verifying" | "done" | "cancelled";

export default function PasskeyButton() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (phase === "prompt") sheetRef.current?.focus();
  }, [phase]);

  const verify = () => {
    setPhase("verifying");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase("done"), 1100);
  };

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("cancelled");
  };

  const status =
    phase === "verifying" ? "認証しています" : phase === "done" ? "サインインしました" : phase === "cancelled" ? "認証がキャンセルされました" : "";

  return (
    <div className="relative mx-auto min-h-[320px] max-w-sm overflow-hidden rounded-lg border bg-card">
      <p className="sr-only" role="status" aria-live="polite">{status}</p>

      {phase === "done" ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center">
          <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <div>
            <div className="text-sm font-medium">ようこそ、山田 葵さん</div>
            <div className="text-xs text-muted-foreground">パスワードなしでサインインしました</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
            サインアウト
          </Button>
        </div>
      ) : (
        <div className="space-y-4 p-6">
          <div className="space-y-1 text-center">
            <div className="text-base font-semibold">Lumen にサインイン</div>
            <div className="text-xs text-muted-foreground">aoi.yamada@example.jp</div>
          </div>
          <Button size="lg" className="w-full" onClick={() => setPhase("prompt")} aria-haspopup="dialog">
            <Fingerprint className="size-5" aria-hidden />
            パスキーでサインイン
          </Button>
          {phase === "cancelled" && (
            <p className="text-center text-xs text-rose-700 dark:text-rose-400">認証がキャンセルされました。もう一度お試しください。</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            または
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" disabled>
            <KeyRound className="size-4" aria-hidden />
            パスワードを使う
          </Button>
          <p className="text-center text-xs text-muted-foreground">指紋・顔認証・端末の PIN で安全にログインできます</p>
        </div>
      )}

      {(phase === "prompt" || phase === "verifying") && (
        <div className="absolute inset-0 flex items-end bg-black/40 motion-safe:animate-in motion-safe:fade-in">
          <div
            ref={sheetRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="パスキーで認証"
            onKeyDown={(e) => e.key === "Escape" && cancel()}
            className="w-full space-y-4 rounded-t-xl border-t bg-popover p-5 text-center text-popover-foreground shadow-xl outline-none motion-safe:animate-in motion-safe:slide-in-from-bottom-4"
          >
            <div className="text-sm font-medium">「lumen.example」にサインインしますか？</div>
            <button
              type="button"
              onClick={verify}
              disabled={phase === "verifying"}
              aria-label="指紋センサーに触れて認証"
              className={cn(
                "relative mx-auto grid size-16 place-items-center rounded-full border-2 transition-colors",
                phase === "verifying"
                  ? "border-sky-500 text-sky-600 dark:border-sky-400 dark:text-sky-400"
                  : "border-border text-muted-foreground hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400",
              )}
            >
              {phase === "verifying" ? <Loader2 className="size-7 motion-safe:animate-spin" aria-hidden /> : <Fingerprint className="size-8" aria-hidden />}
              {phase === "prompt" && (
                <span className="absolute inset-0 rounded-full border-2 border-sky-500/40 motion-safe:animate-ping" aria-hidden />
              )}
            </button>
            <div className="text-xs text-muted-foreground">
              {phase === "verifying" ? "確認しています…" : "センサーに触れてください（クリックで代用）"}
            </div>
            <Button variant="ghost" size="sm" onClick={cancel} disabled={phase === "verifying"}>
              キャンセル
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
