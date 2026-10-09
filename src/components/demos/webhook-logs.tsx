"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Log = { id: string; time: string; event: string; status: number; ms: number; attempts: number };

const INITIAL: Log[] = [
  { id: "evt_8f2a", time: "09:32:14", event: "invoice.paid", status: 200, ms: 142, attempts: 1 },
  { id: "evt_8f1c", time: "09:28:03", event: "order.created", status: 200, ms: 89, attempts: 1 },
  { id: "evt_8e97", time: "09:15:41", event: "customer.updated", status: 500, ms: 5012, attempts: 3 },
  { id: "evt_8e40", time: "08:58:20", event: "subscription.cancelled", status: 410, ms: 63, attempts: 1 },
  { id: "evt_8d11", time: "08:42:07", event: "invoice.paid", status: 200, ms: 102, attempts: 1 },
];

const ok = (s: number) => s >= 200 && s < 300;

export default function WebhookLogs() {
  const [logs, setLogs] = useState(INITIAL);
  const [pending, setPending] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const retry = (l: Log) => {
    setPending((p) => [...p, l.id]);
    setMsg(`${l.event} を再配信しています`);
    timers.current.push(
      setTimeout(() => {
        // Mock: 500 recovers on retry; 410 (endpoint gone) keeps failing.
        const status = l.status === 410 ? 410 : 200;
        const ms = l.status === 410 ? 58 : 131;
        setLogs((ls) => ls.map((x) => (x.id === l.id ? { ...x, status, ms, attempts: x.attempts + 1, time: "09:40:00" } : x)));
        setPending((p) => p.filter((x) => x !== l.id));
        setMsg(ok(status) ? `${l.event} の再配信に成功しました（${status}）` : `${l.event} の再配信に失敗しました（${status}）`);
      }, 1200),
    );
  };

  const failed = logs.filter((l) => !ok(l.status)).length;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="min-w-0 truncate font-mono font-medium">https://api.example.com/hooks</span>
        <span className={cn("tabular-nums", failed ? "text-destructive" : "text-muted-foreground")}>{failed ? `失敗 ${failed} 件` : "すべて成功"}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-medium">時刻</th>
              <th scope="col" className="px-3 py-2 text-left font-medium">イベント</th>
              <th scope="col" className="px-3 py-2 text-left font-medium">応答</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">時間</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((l) => {
              const busy = pending.includes(l.id);
              return (
                <tr key={l.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground tabular-nums">{l.time}</td>
                  <td className="px-3 py-2">
                    <code className="whitespace-nowrap font-mono text-xs">{l.event}</code>
                    {l.attempts > 1 && <span className="ml-1.5 text-[10px] text-muted-foreground tabular-nums">試行 {l.attempts}</span>}
                  </td>
                  <td className="px-3 py-2">
                    {ok(l.status) ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" aria-hidden />
                        {l.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-destructive">
                        <XCircle className="size-3.5" aria-hidden />
                        {l.status}
                      </span>
                    )}
                  </td>
                  <td className={cn("px-3 py-2 text-right text-xs tabular-nums", l.ms > 3000 ? "text-destructive" : "text-muted-foreground")}>
                    {l.ms.toLocaleString("ja-JP")} ms
                  </td>
                  <td className="px-3 py-2 text-right">
                    {!ok(l.status) && (
                      <button
                        type="button"
                        onClick={() => retry(l)}
                        disabled={busy}
                        aria-label={`${l.event}（${l.id}）を再配信`}
                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
                      >
                        {busy ? <Loader2 className="size-3 animate-spin" aria-hidden /> : <RefreshCw className="size-3" aria-hidden />}
                        {busy ? "送信中" : "再配信"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {msg}
      </p>
    </div>
  );
}
