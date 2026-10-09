"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const corpus = [
  { t: "ストライプ的な美しい価格表ページの作り方", topic: "pricing" },
  { t: "Linear 風コマンドパレットの実装", topic: "command palette" },
  { t: "Figma のリアルタイム同期はどう動くか", topic: "collaboration" },
  { t: "AI streaming UI のベストプラクティス", topic: "ai" },
  { t: "Notion の slash commands を作る", topic: "rich text" },
];

export default function SemanticSearch() {
  const [q, setQ] = useState("お金を払ってもらう画面");
  const score = (item: typeof corpus[number]) => {
    const map: Record<string, string> = { "お金": "pricing", "支払": "pricing", "コラボ": "collaboration", "AI": "ai" };
    for (const k in map) if (q.includes(k) && item.topic === map[k]) return 0.95;
    return 0.2;
  };
  const ranked = [...corpus].map((c) => ({ ...c, s: score(c) })).sort((a, b) => b.s - a.s);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <Sparkles className="size-4 text-blue-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="意味で検索..." />
      </div>
      <ul className="space-y-1">
        {ranked.map((r) => (
          <li key={r.t} className="flex items-center justify-between text-sm rounded-md border bg-background px-3 py-2">
            <span>{r.t}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{(r.s * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
