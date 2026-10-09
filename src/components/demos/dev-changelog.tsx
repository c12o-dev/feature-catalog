"use client";

import { Badge } from "@/components/ui/badge";

const items = [
  { v: "v3.2.0", date: "2026-04-20", changes: [{ tag: "BREAKING", body: "users.list がデフォルトで 50 件返却 (旧: 100)" }, { tag: "ADD", body: "users.search エンドポイント追加" }] },
  { v: "v3.1.0", date: "2026-04-05", changes: [{ tag: "ADD", body: "Webhook イベント user.suspended を追加" }, { tag: "FIX", body: "rate limit ヘッダーの値が 1 ずれていた" }] },
];

export default function DevChangelog() {
  return (
    <div className="space-y-3 max-w-md">
      {items.map((it) => (
        <div key={it.v} className="rounded-md border bg-background p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono font-semibold text-sm">{it.v}</span>
            <span className="text-xs text-muted-foreground">{it.date}</span>
          </div>
          <ul className="space-y-1 text-xs">
            {it.changes.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <Badge variant={c.tag === "BREAKING" ? "destructive" : c.tag === "ADD" ? "default" : "secondary"} className="text-[9px] shrink-0">{c.tag}</Badge>
                <span>{c.body}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
