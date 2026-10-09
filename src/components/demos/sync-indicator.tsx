"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudOff, Loader2 } from "lucide-react";

export default function SyncIndicator() {
  const [s, setS] = useState<"synced" | "syncing" | "offline">("synced");
  const [last, setLast] = useState(5);
  useEffect(() => {
    const id = setInterval(() => setLast((l) => l + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-2 max-w-sm">
      <div className="flex items-center gap-2 text-xs">
        {s === "syncing" && <><Loader2 className="size-3.5 animate-spin text-blue-500" />同期中...</>}
        {s === "synced" && <><Cloud className="size-3.5 text-emerald-500" />Synced {last}s ago</>}
        {s === "offline" && <><CloudOff className="size-3.5 text-amber-500" />オフライン</>}
      </div>
      <div className="flex gap-1">
        <button onClick={() => setS("syncing")} className="rounded border px-2 py-0.5 text-xs">同期中</button>
        <button onClick={() => { setS("synced"); setLast(0); }} className="rounded border px-2 py-0.5 text-xs">完了</button>
        <button onClick={() => setS("offline")} className="rounded border px-2 py-0.5 text-xs">オフライン</button>
      </div>
    </div>
  );
}
