"use client";

import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "pending" | "approved" | "rejected";

export default function ApprovalFlow() {
  const [reviewers, setReviewers] = useState([
    { name: "Alice", status: "approved" as Status },
    { name: "Bob", status: "pending" as Status },
    { name: "Carol", status: "pending" as Status },
  ]);
  const set = (i: number, s: Status) => setReviewers((r) => r.map((x, j) => j === i ? { ...x, status: s } : x));
  const overall: Status = reviewers.every((r) => r.status === "approved") ? "approved" : reviewers.some((r) => r.status === "rejected") ? "rejected" : "pending";
  return (
    <div className="space-y-3 max-w-md">
      <div className={`rounded-md p-2.5 text-xs font-medium ${overall === "approved" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" : overall === "rejected" ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300" : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"}`}>
        全体ステータス: {overall === "approved" ? "✓ 承認" : overall === "rejected" ? "✕ 却下" : "⌛ 承認待ち"}
      </div>
      <ul className="rounded-md border bg-background divide-y">
        {reviewers.map((r, i) => (
          <li key={r.name} className="flex items-center gap-2 px-3 py-2 text-sm">
            <span className="flex-1">{r.name}</span>
            {r.status === "approved" && <Check className="size-4 text-emerald-600" />}
            {r.status === "rejected" && <X className="size-4 text-red-600" />}
            {r.status === "pending" && (
              <div className="flex gap-1">
                <Button size="xs" variant="ghost" onClick={() => set(i, "approved")}><Check className="size-3 text-emerald-600" /></Button>
                <Button size="xs" variant="ghost" onClick={() => set(i, "rejected")}><X className="size-3 text-red-600" /></Button>
              </div>
            )}
            {r.status === "pending" && <Clock className="size-3.5 text-muted-foreground" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
