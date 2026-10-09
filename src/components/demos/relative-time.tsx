"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const REF = Date.parse("2026-10-01T09:00:00+09:00");

const initial = [
  { name: "デザインレビューのメモ", t: REF - 30_000 },
  { name: "リリースノート v2.4", t: REF - 5 * 60_000 },
  { name: "週次定例の議事録", t: REF - 2 * 3600_000 },
  { name: "採用ページの文言案", t: REF - 26 * 3600_000 },
  { name: "Q3 振り返り", t: REF - 8 * 24 * 3600_000 },
];

function rel(now: number, t: number): string {
  const d = Math.max(0, (now - t) / 1000);
  if (d < 10) return "たった今";
  if (d < 60) return `${Math.floor(d)} 秒前`;
  if (d < 3600) return `${Math.floor(d / 60)} 分前`;
  if (d < 86400) return `${Math.floor(d / 3600)} 時間前`;
  if (d < 7 * 86400) return `${Math.floor(d / 86400)} 日前`;
  return `${Math.floor(d / (7 * 86400))} 週間前`;
}

const absFmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default function RelativeTime() {
  // Simulated clock: starts at the fixed reference time and advances 1 s per tick.
  const [elapsed, setElapsed] = useState(0);
  const [items, setItems] = useState(initial);
  const now = REF + elapsed * 1000;

  useEffect(() => {
    const id = setInterval(() => setElapsed((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const [added, setAdded] = useState(0);
  const add = () => {
    const n = added + 1;
    setAdded(n);
    setItems((xs) => [{ name: `新しいメモ ${n}`, t: now }, ...xs].slice(0, 6));
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">ホバーで絶対時刻を表示</span>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="size-3.5" />
          追加
        </Button>
      </div>
      <ul className="space-y-1">
        {items.map((it) => {
          const abs = absFmt.format(it.t);
          return (
            <li key={it.name} className="flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2 text-sm">
              <span className="min-w-0 truncate">{it.name}</span>
              <time
                dateTime={new Date(it.t).toISOString()}
                title={abs}
                tabIndex={0}
                aria-label={`${rel(now, it.t)}（${abs}）`}
                className="shrink-0 rounded text-xs text-muted-foreground tabular-nums underline decoration-dotted underline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
              >
                {rel(now, it.t)}
              </time>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
