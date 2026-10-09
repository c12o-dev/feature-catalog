"use client";

import { useState } from "react";
import { Sparkles, Search } from "lucide-react";

const examples = ["先週デプロイされた変更は？", "アクティブユーザーが最も多い時間帯", "課金エラーの原因 top 3"];

export default function AskAnything() {
  const [q, setQ] = useState("");
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-background p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-blue-500" />
          <span className="text-sm font-medium">Ask anything</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="自然言語で質問..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        {!q && (
          <div className="mt-2 space-y-1">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">examples</div>
            {examples.map((e) => (
              <button key={e} onClick={() => setQ(e)} className="block w-full text-left text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded px-2 py-1">
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
