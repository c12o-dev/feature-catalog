"use client";

import { useEffect, useId, useState } from "react";
import { CheckCircle2, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TOTAL_MB = 48.6;
// Uneven, deterministic steps so the bar feels like a real upload.
const STEPS = [4, 9, 6, 11, 3, 8, 12, 5, 7, 10, 6, 4, 9, 6];

type State = "idle" | "uploading" | "done";

export default function ProgressBar() {
  const [v, setV] = useState(0);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>("idle");
  const labelId = useId();

  useEffect(() => {
    if (state !== "uploading") return;
    const id = setTimeout(() => {
      const next = Math.min(100, v + STEPS[step % STEPS.length]);
      setV(next);
      setStep((s) => s + 1);
      if (next >= 100) setState("done");
    }, 220);
    return () => clearTimeout(id);
  }, [v, step, state]);

  const start = () => {
    setV(0);
    setStep(0);
    setState("uploading");
  };

  const label = state === "idle" ? (v > 0 ? "一時停止中" : "アップロード待ち") : state === "uploading" ? "アップロード中" : "アップロード完了";
  const sent = ((TOTAL_MB * v) / 100).toFixed(1);

  return (
    <div className="mx-auto w-full max-w-sm space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-muted">
          <FileVideo className="size-4 text-muted-foreground" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">product-demo.mp4</div>
          <div id={labelId} className="flex items-center gap-1 text-xs text-muted-foreground">
            {state === "done" && <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />}
            {label}
          </div>
        </div>
        <span className="text-sm font-medium tabular-nums">{v}%</span>
      </div>

      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        aria-valuetext={`${v}%（${sent} / ${TOTAL_MB} MB）`}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full w-full origin-left rounded-full transition-transform duration-200 ease-out", state === "done" ? "bg-emerald-500 dark:bg-emerald-400" : "bg-primary")}
          style={{ transform: `scaleX(${v / 100})` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground tabular-nums">
          {sent} / {TOTAL_MB} MB
        </span>
        {state === "uploading" ? (
          <Button size="sm" variant="ghost" onClick={() => setState("idle")}>
            一時停止
          </Button>
        ) : (
          <Button size="sm" variant={state === "done" ? "outline" : "default"} onClick={state === "idle" && v > 0 ? () => setState("uploading") : start}>
            {state === "done" ? "もう一度" : v > 0 ? "再開" : "アップロード開始"}
          </Button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {state === "done" ? "アップロードが完了しました" : ""}
      </p>
    </div>
  );
}
