"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "ok" | "investigating" | "monitoring";

const PHASES: Record<Phase, { title: string; body: string; time: string }> = {
  ok: { title: "すべてのシステムは正常に稼働しています", body: "過去 90 日間の稼働率 99.97%", time: "" },
  investigating: { title: "API の応答が遅延しています", body: "一部のリクエストでタイムアウトが発生しています。原因を調査中です。", time: "09:12 更新" },
  monitoring: { title: "対応済み・経過観察中", body: "データベースの設定を修正し、応答時間は正常値に戻りつつあります。", time: "09:41 更新" },
};

const NEXT: Record<Phase, Phase> = { ok: "investigating", investigating: "monitoring", monitoring: "ok" };
const ACTION: Record<Phase, string> = { ok: "障害を発生させる", investigating: "対応を進める", monitoring: "復旧させる" };

const COMPONENTS = ["Web アプリ", "API", "通知", "決済"];

export default function ServiceStatus() {
  const [phase, setPhase] = useState<Phase>("ok");
  const p = PHASES[phase];

  return (
    <div className="mx-auto max-w-md space-y-3">
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-lg border p-3",
          phase === "ok" && "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10",
          phase === "investigating" && "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
          phase === "monitoring" && "border-sky-200 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10",
        )}
      >
        <div className="flex items-start gap-2">
          {phase === "ok" && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />}
          {phase === "investigating" && <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />}
          {phase === "monitoring" && <Eye className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="text-sm font-medium">{p.title}</span>
              {p.time && <span className="text-xs text-muted-foreground tabular-nums">{p.time}</span>}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{p.body}</p>
          </div>
        </div>
      </div>

      <ul className="divide-y rounded-lg border bg-card text-sm">
        {COMPONENTS.map((c) => {
          const affected = c === "API" && phase !== "ok";
          return (
            <li key={c} className="flex items-center justify-between px-3 py-2">
              <span>{c}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs",
                  affected
                    ? phase === "investigating"
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-sky-700 dark:text-sky-400"
                    : "text-emerald-700 dark:text-emerald-400",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    affected ? (phase === "investigating" ? "bg-amber-500" : "bg-sky-500") : "bg-emerald-500",
                  )}
                  aria-hidden
                />
                {affected ? (phase === "investigating" ? "遅延" : "経過観察") : "正常"}
              </span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => setPhase(NEXT[phase])}
        className="rounded-md border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        シミュレート: {ACTION[phase]}
      </button>
    </div>
  );
}
