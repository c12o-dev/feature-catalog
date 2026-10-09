"use client";

import { useState } from "react";
import { Search, FileText, User, Hash } from "lucide-react";

const data = [
  { type: "doc", icon: FileText, title: "Q1 戦略ドキュメント" },
  { type: "person", icon: User, title: "Alice Tanaka" },
  { type: "channel", icon: Hash, title: "#engineering" },
  { type: "doc", icon: FileText, title: "API 設計レビュー" },
  { type: "person", icon: User, title: "Bob Sato" },
];

export default function GlobalSearch() {
  const [q, setQ] = useState("");
  const filtered = q ? data.filter((d) => d.title.toLowerCase().includes(q.toLowerCase())) : data;
  const groups = filtered.reduce((g, item) => {
    (g[item.type] ||= []).push(item);
    return g;
  }, {} as Record<string, typeof data>);
  const labels: Record<string, string> = { doc: "ドキュメント", person: "メンバー", channel: "チャンネル" };
  return (
    <div className="max-w-md space-y-3">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="全体検索..." className="flex-1 bg-transparent outline-none text-sm" />
      </div>
      <div className="rounded-md border bg-background overflow-hidden">
        {Object.entries(groups).map(([type, items]) => (
          <div key={type}>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground px-3 pt-2">{labels[type]}</div>
            {items.map((it) => (
              <div key={it.title} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent cursor-pointer">
                <it.icon className="size-3.5 text-muted-foreground" />{it.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
