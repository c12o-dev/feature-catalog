"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function SwrIndicator() {
  const [count, setCount] = useState(42);
  const [revalidating, setRevalidating] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setRevalidating(true);
      setTimeout(() => { setCount((c) => c + Math.floor(Math.random() * 5) - 2); setRevalidating(false); }, 800);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-2 max-w-sm">
      <div className="rounded-md border bg-background p-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">アクティブユーザー</div>
          <div className="text-2xl font-semibold tabular-nums transition-all">{count}</div>
        </div>
        {revalidating && <RefreshCw className="size-3.5 text-muted-foreground animate-spin" />}
      </div>
      <div className="text-xs text-muted-foreground text-center">既存値を表示しつつバックグラウンドで再検証</div>
    </div>
  );
}
