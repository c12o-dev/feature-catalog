"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

export default function PullToRefresh() {
  const [pulling, setPulling] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const start = () => {
    if (refresh) return;
    setPulling(true);
    setTimeout(() => { setPulling(false); setRefresh(true); setTimeout(() => setRefresh(false), 1200); }, 300);
  };
  return (
    <div className="rounded-md border bg-background h-44 overflow-hidden">
      <div className={`flex items-center justify-center text-xs text-muted-foreground transition-all ${pulling || refresh ? "h-10" : "h-0"}`}>
        {refresh ? <><Loader2 className="size-3.5 animate-spin mr-1" />更新中</> : pulling && <><RefreshCw className="size-3.5 mr-1" />離して更新</>}
      </div>
      <button onClick={start} className="block w-full text-left p-3 text-sm hover:bg-accent">タップで「↓ 引っ張って更新」をシミュレート</button>
      <ul className="px-3 text-sm divide-y">
        <li className="py-2">投稿 1</li>
        <li className="py-2">投稿 2</li>
        <li className="py-2">投稿 3</li>
      </ul>
    </div>
  );
}
