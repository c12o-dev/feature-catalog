"use client";

import { useEffect, useState } from "react";

const sample = [
  { lvl: "info", msg: "Server listening on :3000" },
  { lvl: "info", msg: "GET /api/users 200 12ms" },
  { lvl: "warn", msg: "Slow query: SELECT * FROM logs (843ms)" },
  { lvl: "info", msg: "POST /api/login 200 45ms" },
  { lvl: "error", msg: "Failed to fetch external API: ETIMEDOUT" },
  { lvl: "info", msg: "GET /api/orders 200 8ms" },
];

const cls: Record<string, string> = { info: "text-blue-600", warn: "text-amber-600", error: "text-red-600" };

export default function LogViewer() {
  const [logs, setLogs] = useState<{ lvl: string; msg: string; t: string }[]>([]);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const s = sample[i % sample.length];
      setLogs((l) => [...l.slice(-7), { ...s, t: new Date().toLocaleTimeString() }]);
      i++;
    }, 800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="font-mono text-xs rounded-md border bg-zinc-950 text-zinc-100 p-3 h-44 overflow-y-auto">
      {logs.map((l, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-zinc-500">{l.t}</span>
          <span className={`uppercase font-semibold w-12 ${cls[l.lvl]}`}>{l.lvl}</span>
          <span>{l.msg}</span>
        </div>
      ))}
      {logs.length === 0 && <div className="text-zinc-500">streaming...</div>}
    </div>
  );
}
