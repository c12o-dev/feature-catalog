"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

const chips = ["要約してみる", "次のアクション提案", "似た案件を探す"];

export default function ProactiveChip() {
  const [visible, setVisible] = useState(chips);
  const dismiss = (c: string) => setVisible((v) => v.filter((x) => x !== c));
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">ユーザーの行動から AI がプロアクティブに提案</div>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((c) => (
          <div key={c} className="inline-flex items-center gap-1 text-xs rounded-full border-2 border-dashed border-blue-300 bg-blue-50/60 dark:bg-blue-950/40 px-2.5 py-1">
            <Sparkles className="size-3 text-blue-500" />{c}
            <button onClick={() => dismiss(c)}><X className="size-3 text-muted-foreground" /></button>
          </div>
        ))}
        {visible.length === 0 && <button onClick={() => setVisible(chips)} className="text-xs text-muted-foreground">候補を再表示</button>}
      </div>
    </div>
  );
}
