"use client";

import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const logs = [
  { time: "10:32", event: "user.created", status: 200, ms: 142 },
  { time: "10:28", event: "order.paid", status: 200, ms: 89 },
  { time: "10:15", event: "user.created", status: 500, ms: 5012 },
  { time: "09:42", event: "subscription.cancelled", status: 200, ms: 102 },
];

export default function WebhookLogs() {
  return (
    <div className="rounded-md border bg-background overflow-hidden text-sm">
      <table className="w-full">
        <thead className="bg-muted/30 text-xs">
          <tr><th className="text-left p-2">時刻</th><th className="text-left p-2">イベント</th><th className="text-left p-2">状況</th><th className="text-right p-2">ms</th><th></th></tr>
        </thead>
        <tbody className="divide-y">
          {logs.map((l, i) => (
            <tr key={i} className="hover:bg-accent">
              <td className="p-2 tabular-nums text-xs">{l.time}</td>
              <td className="p-2"><code className="text-xs">{l.event}</code></td>
              <td className="p-2">{l.status === 200 ? <span className="text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="size-3" />{l.status}</span> : <span className="text-red-600 inline-flex items-center gap-1"><XCircle className="size-3" />{l.status}</span>}</td>
              <td className="p-2 text-right tabular-nums text-xs">{l.ms}</td>
              <td className="p-2">{l.status !== 200 && <button className="text-blue-600 text-xs inline-flex items-center gap-0.5 hover:underline"><RefreshCw className="size-3" />retry</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
