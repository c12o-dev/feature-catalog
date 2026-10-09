"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

export default function PrefetchOnHover() {
  const [hov, setHov] = useState(false);
  const [pf, setPf] = useState(false);
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-xs text-muted-foreground">リンクに hover したタイミングで先読み開始</div>
      <a
        onMouseEnter={() => { setHov(true); setTimeout(() => setPf(true), 300); }}
        onMouseLeave={() => { setHov(false); setPf(false); }}
        className="inline-block rounded-md border bg-background px-3 py-2 text-sm cursor-pointer hover:bg-accent"
      >
        重い詳細ページへ →
      </a>
      <div className="flex items-center gap-2 text-xs">
        {hov && (
          <>
            <Zap className="size-3.5 text-amber-500" />
            <span>{pf ? "✓ prefetched (data + JS)" : "prefetching..."}</span>
          </>
        )}
      </div>
    </div>
  );
}
