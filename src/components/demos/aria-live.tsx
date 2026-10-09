"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AriaLive() {
  const [msgs, setMsgs] = useState<string[]>([]);
  const add = () => setMsgs((m) => [...m, `通知 ${m.length + 1}: 新しいメッセージが届きました (${new Date().toLocaleTimeString()})`]);
  return (
    <div className="space-y-2 max-w-md">
      <Button size="sm" onClick={add}>通知を追加 (live region で読み上げ)</Button>
      <div role="log" aria-live="polite" className="rounded-md border bg-background p-3 text-sm space-y-1 min-h-[6rem]">
        {msgs.map((m, i) => <div key={i}>{m}</div>)}
        {msgs.length === 0 && <div className="text-xs text-muted-foreground">スクリーンリーダーが ARIA live region の更新を読み上げます</div>}
      </div>
    </div>
  );
}
