"use client";

import { useState } from "react";
import { Check, Clock, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";
type Reviewer = { name: string; role: string; status: Status };

const INITIAL: Reviewer[] = [
  { name: "高橋 美咲", role: "チームリード", status: "approved" },
  { name: "田中 健", role: "経理", status: "pending" },
  { name: "鈴木 彩", role: "法務", status: "pending" },
];

const STATUS_LABEL: Record<Status, string> = { approved: "承認済み", rejected: "却下", pending: "承認待ち" };

export default function ApprovalFlow() {
  const [reviewers, setReviewers] = useState(INITIAL);
  const [announce, setAnnounce] = useState("");

  const set = (i: number, s: Status) => {
    setReviewers((r) => r.map((x, j) => (j === i ? { ...x, status: s } : x)));
    setAnnounce(`${reviewers[i].name} が${s === "approved" ? "承認" : "却下"}しました`);
  };

  const overall: Status = reviewers.some((r) => r.status === "rejected")
    ? "rejected"
    : reviewers.every((r) => r.status === "approved")
      ? "approved"
      : "pending";
  const approvedCount = reviewers.filter((r) => r.status === "approved").length;

  return (
    <div className="mx-auto max-w-md space-y-3">
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
      <div className="rounded-lg border bg-card p-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">経費申請 #2041</div>
            <div className="text-sm font-medium">展示会出展費（10 月）¥ 480,000</div>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              overall === "approved" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
              overall === "rejected" && "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
              overall === "pending" && "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
            )}
          >
            {overall === "approved" ? <Check className="size-3" aria-hidden /> : overall === "rejected" ? <X className="size-3" aria-hidden /> : <Clock className="size-3" aria-hidden />}
            {STATUS_LABEL[overall]}
          </span>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>
          {reviewers.map((r) => (
            <span
              key={r.name}
              className={cn(
                "h-1 flex-1 rounded-full",
                r.status === "approved" ? "bg-emerald-500" : r.status === "rejected" ? "bg-rose-500" : "bg-muted",
              )}
            />
          ))}
        </div>
        <div className="mt-1 text-xs text-muted-foreground tabular-nums">
          {approvedCount} / {reviewers.length} 名が承認
        </div>
      </div>

      <ul className="divide-y rounded-lg border bg-card">
        {reviewers.map((r, i) => (
          <li key={r.name} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-sm">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium" aria-hidden>
              {r.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.role}</div>
            </div>
            {r.status === "pending" && overall !== "rejected" ? (
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => set(i, "rejected")} aria-label={`${r.name} として却下`}>
                  <X className="size-3.5 text-rose-600 dark:text-rose-400" aria-hidden />
                  却下
                </Button>
                <Button size="sm" onClick={() => set(i, "approved")} aria-label={`${r.name} として承認`}>
                  <Check className="size-3.5" aria-hidden />
                  承認
                </Button>
              </div>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs",
                  r.status === "approved" && "text-emerald-700 dark:text-emerald-400",
                  r.status === "rejected" && "text-rose-700 dark:text-rose-400",
                  r.status === "pending" && "text-muted-foreground",
                )}
              >
                {r.status === "approved" ? <Check className="size-3.5" aria-hidden /> : r.status === "rejected" ? <X className="size-3.5" aria-hidden /> : <Clock className="size-3.5" aria-hidden />}
                {r.status === "pending" ? "不要" : STATUS_LABEL[r.status]}
              </span>
            )}
          </li>
        ))}
      </ul>

      {overall !== "pending" && (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => { setReviewers(INITIAL); setAnnounce("申請を差し戻しました"); }}>
            <RotateCcw className="size-3.5" aria-hidden />
            やり直す
          </Button>
        </div>
      )}
    </div>
  );
}
