"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "paid" | "due" | "failed";
const invoices: { id: string; date: string; amount: number; status: Status }[] = [
  { id: "INV-2026-10", date: "2026年10月1日", amount: 3980, status: "due" },
  { id: "INV-2026-09", date: "2026年9月1日", amount: 3980, status: "failed" },
  { id: "INV-2026-08", date: "2026年8月1日", amount: 3980, status: "paid" },
  { id: "INV-2026-07", date: "2026年7月1日", amount: 1980, status: "paid" },
];

const statusLabel: Record<Status, { text: string; cls: string }> = {
  paid: { text: "支払済", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900" },
  due: { text: "未払い", cls: "bg-muted text-muted-foreground border-border" },
  failed: { text: "決済失敗", cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900" },
};

export default function InvoiceList() {
  const [state, setState] = useState<Record<string, "loading" | "done">>({});
  const [msg, setMsg] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const download = (id: string) => {
    if (state[id] === "loading") return;
    setState((s) => ({ ...s, [id]: "loading" }));
    setMsg(`${id}.pdf を準備しています`);
    timers.current.push(
      window.setTimeout(() => {
        setState((s) => ({ ...s, [id]: "done" }));
        setMsg(`${id}.pdf をダウンロードしました`);
      }, 1200),
    );
  };

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <span className="text-sm font-semibold">請求書</span>
        <span className="text-xs text-muted-foreground">Pro プラン · 月払い</span>
      </div>
      <ul className="divide-y">
        {invoices.map((inv) => {
          const st = state[inv.id];
          return (
            <li key={inv.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5">
              <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-xs">{inv.id}</div>
                <div className="text-xs text-muted-foreground">{inv.date}</div>
              </div>
              <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", statusLabel[inv.status].cls)}>
                {statusLabel[inv.status].text}
              </span>
              <span className="w-16 text-right text-sm tabular-nums">¥{inv.amount.toLocaleString("ja-JP")}</span>
              <button
                type="button"
                onClick={() => download(inv.id)}
                aria-label={`${inv.id} の PDF をダウンロード`}
                aria-busy={st === "loading"}
                className="flex h-8 items-center gap-1.5 rounded-md border px-2 text-xs hover:bg-muted"
              >
                {st === "loading" ? (
                  <Loader2 className="size-3.5 motion-safe:animate-spin" />
                ) : st === "done" ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Download className="size-3.5" />
                )}
                PDF
              </button>
            </li>
          );
        })}
      </ul>
      <p className="border-t px-3 py-2 text-xs text-muted-foreground" aria-live="polite">
        {msg || "各行の PDF から請求書をダウンロードできます"}
      </p>
    </div>
  );
}
