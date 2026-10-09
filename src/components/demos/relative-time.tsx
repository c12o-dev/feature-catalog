"use client";

import { useEffect, useState } from "react";

const items = [
  { name: "投稿 A", t: Date.now() - 30_000 },
  { name: "投稿 B", t: Date.now() - 5 * 60_000 },
  { name: "投稿 C", t: Date.now() - 2 * 3600_000 },
  { name: "投稿 D", t: Date.now() - 26 * 3600_000 },
  { name: "投稿 E", t: Date.now() - 8 * 24 * 3600_000 },
];

function rel(t: number): string {
  const d = (Date.now() - t) / 1000;
  if (d < 60) return `${Math.floor(d)} 秒前`;
  if (d < 3600) return `${Math.floor(d / 60)} 分前`;
  if (d < 86400) return `${Math.floor(d / 3600)} 時間前`;
  if (d < 7 * 86400) return `${Math.floor(d / 86400)} 日前`;
  return `${Math.floor(d / (7 * 86400))} 週間前`;
}

export default function RelativeTime() {
  const [, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((x) => x + 1), 5000); return () => clearInterval(id); }, []);
  return (
    <ul className="space-y-1 max-w-sm">
      {items.map((it) => (
        <li key={it.name} className="flex items-center justify-between rounded-md border bg-background px-3 py-1.5 text-sm">
          <span>{it.name}</span>
          <span className="text-xs text-muted-foreground tabular-nums">{rel(it.t)}</span>
        </li>
      ))}
    </ul>
  );
}
