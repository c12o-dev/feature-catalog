"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Clock, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "success" | "running" | "pending" | "failure";

const jobs = ["build", "lint", "test", "e2e", "deploy"];
const initial: Status[] = ["success", "success", "running", "failure", "pending"];
// Deterministic outcome of a re-run.
const finalOutcome: Status[] = ["success", "success", "success", "success", "success"];

const meta: Record<Status, { label: string; Icon: typeof Clock; badge: string; dot: string }> = {
  success: { label: "成功", Icon: CheckCircle2, badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/30", dot: "bg-emerald-500" },
  running: { label: "実行中", Icon: Loader2, badge: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/30", dot: "bg-blue-500" },
  pending: { label: "待機", Icon: Clock, badge: "bg-muted text-muted-foreground ring-border", dot: "bg-muted-foreground/50" },
  failure: { label: "失敗", Icon: XCircle, badge: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/30", dot: "bg-red-500" },
};

export default function StatusBadge() {
  const [statuses, setStatuses] = useState<Status[]>(initial);
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const rerun = () => {
    clear();
    setBusy(true);
    setStatuses(jobs.map((_, i) => (i === 0 ? "running" : "pending")));
    jobs.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setStatuses((s) => s.map((v, j) => (j === i ? finalOutcome[i] : j === i + 1 ? "running" : v)));
          if (i === jobs.length - 1) setBusy(false);
        }, 900 * (i + 1)),
      );
    });
  };


  return (
    <div className="w-full max-w-sm space-y-2">
      <ul className="divide-y rounded-md border bg-card" aria-live="polite">
        {jobs.map((name, i) => {
          const m = meta[statuses[i]];
          return (
            <li key={name} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className={cn("size-2 shrink-0 rounded-full", m.dot, statuses[i] === "running" && "motion-safe:animate-pulse")} aria-hidden />
              <span className="font-mono">{name}</span>
              <span className={cn("ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", m.badge)}>
                <m.Icon className={cn("size-3", statuses[i] === "running" && "motion-safe:animate-spin")} aria-hidden />
                {m.label}
              </span>
            </li>
          );
        })}
      </ul>
      <Button size="sm" variant="outline" onClick={rerun} disabled={busy}>
        <RotateCw className="size-3.5" />
        再実行
      </Button>
    </div>
  );
}
