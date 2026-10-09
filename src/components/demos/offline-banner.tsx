"use client";

import { useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [off, setOff] = useState(true);
  return (
    <div className="space-y-2">
      <button onClick={() => setOff((o) => !o)} className="text-xs text-muted-foreground">{off ? "オンラインに戻る" : "オフラインにする"}</button>
      {off && (
        <div className="flex items-center gap-2 rounded bg-zinc-900 text-white px-3 py-2 text-sm">
          <WifiOff className="size-4" />オフラインです。変更はローカルに保存されます。
        </div>
      )}
    </div>
  );
}
