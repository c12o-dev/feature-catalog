"use client";

import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

const items = [
  { name: "build", status: "success", color: "text-emerald-600" },
  { name: "test", status: "running", color: "text-blue-600" },
  { name: "lint", status: "success", color: "text-emerald-600" },
  { name: "deploy", status: "pending", color: "text-zinc-500" },
  { name: "e2e", status: "failure", color: "text-red-600" },
];

const Icon = {
  success: CheckCircle2,
  running: Loader2,
  pending: Clock,
  failure: XCircle,
} as const;

export default function StatusBadge() {
  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => {
        const I = Icon[it.status as keyof typeof Icon];
        return (
          <div key={it.name} className="flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm">
            <I className={`size-4 ${it.color} ${it.status === "running" ? "animate-spin" : ""}`} />
            <span className="font-mono">{it.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{it.status}</span>
          </div>
        );
      })}
    </div>
  );
}
