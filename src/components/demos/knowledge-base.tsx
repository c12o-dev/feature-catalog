"use client";

import { useState } from "react";
import { Search, FileText, ChevronRight } from "lucide-react";

const cats = [
  { name: "始め方", count: 8, color: "bg-blue-100 dark:bg-blue-950" },
  { name: "アカウント", count: 12, color: "bg-emerald-100 dark:bg-emerald-950" },
  { name: "課金", count: 6, color: "bg-amber-100 dark:bg-amber-950" },
  { name: "API", count: 18, color: "bg-purple-100 dark:bg-purple-950" },
];

export default function KnowledgeBase() {
  const [q, setQ] = useState("");
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ヘルプ記事を検索..." className="flex-1 bg-transparent outline-none text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cats.map((c) => (
          <div key={c.name} className={`rounded-md ${c.color} p-3 cursor-pointer`}>
            <FileText className="size-5 mb-1" />
            <div className="text-sm font-medium flex items-center justify-between">{c.name}<ChevronRight className="size-3.5" /></div>
            <div className="text-xs text-muted-foreground">{c.count} 記事</div>
          </div>
        ))}
      </div>
    </div>
  );
}
