"use client";

import { useState } from "react";
import { Clock, X, Star } from "lucide-react";

const initial = [
  { q: "売上 Q1 月別", saved: true },
  { q: "active users last 7 days", saved: false },
  { q: "エラーログ deploy:v2", saved: false },
  { q: "新規登録 by source", saved: true },
];

export default function SearchHistory() {
  const [list, setList] = useState(initial);
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-xs font-medium flex items-center gap-1.5"><Clock className="size-3.5" />検索履歴</div>
      <ul className="rounded-md border bg-background divide-y">
        {list.map((it, i) => (
          <li key={i} className="flex items-center gap-2 px-3 py-2 text-sm">
            <button onClick={() => setList((l) => l.map((x, j) => j === i ? { ...x, saved: !x.saved } : x))}>
              <Star className={`size-3.5 ${it.saved ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            </button>
            <span className="flex-1">{it.q}</span>
            <button onClick={() => setList((l) => l.filter((_, j) => j !== i))}><X className="size-3 text-muted-foreground" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
