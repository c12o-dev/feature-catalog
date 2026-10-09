"use client";

import { AlertTriangle } from "lucide-react";

const log = [
  { time: "2026-04-26 10:32", ip: "10.0.1.5", loc: "Tokyo, JP", ok: true },
  { time: "2026-04-25 14:18", ip: "203.0.113.42", loc: "Bangkok, TH", ok: false },
  { time: "2026-04-25 09:00", ip: "10.0.1.5", loc: "Tokyo, JP", ok: true },
  { time: "2026-04-24 22:10", ip: "10.0.1.5", loc: "Tokyo, JP", ok: true },
];

export default function LoginHistory() {
  return (
    <div className="rounded-md border bg-background overflow-hidden text-sm">
      <table className="w-full">
        <thead className="bg-muted/30 text-xs">
          <tr><th className="text-left p-2">日時</th><th className="text-left p-2">IP</th><th className="text-left p-2">場所</th><th className="text-left p-2">状況</th></tr>
        </thead>
        <tbody className="divide-y">
          {log.map((l, i) => (
            <tr key={i} className={l.ok ? "" : "bg-amber-50 dark:bg-amber-950/30"}>
              <td className="p-2 tabular-nums text-xs">{l.time}</td>
              <td className="p-2 font-mono text-xs">{l.ip}</td>
              <td className="p-2 text-xs">{l.loc}</td>
              <td className="p-2 text-xs">{l.ok ? <span className="text-emerald-600">✓</span> : <span className="text-amber-600 inline-flex items-center gap-1"><AlertTriangle className="size-3" />不審</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
