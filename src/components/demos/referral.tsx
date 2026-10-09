"use client";

import { useState } from "react";
import { Copy, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const url = "https://example.com/r/c12o-x9k4";
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div className="space-y-3 max-w-md">
      <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4">
        <Gift className="size-6 mb-2" />
        <div className="font-semibold">友達を招待して 1000 ポイント</div>
        <div className="text-xs opacity-90">招待された友達も同じく 1000 ポイントゲット</div>
      </div>
      <div className="flex items-center gap-2 rounded-md border bg-background p-2 pl-3">
        <code className="flex-1 text-xs text-muted-foreground truncate">{url}</code>
        <Button size="sm" variant="outline" onClick={copy}>{copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}</Button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded border p-2"><div className="text-lg font-semibold">3</div><div className="text-[10px] text-muted-foreground">招待済</div></div>
        <div className="rounded border p-2"><div className="text-lg font-semibold">2</div><div className="text-[10px] text-muted-foreground">登録</div></div>
        <div className="rounded border p-2"><div className="text-lg font-semibold">2,000</div><div className="text-[10px] text-muted-foreground">獲得 P</div></div>
      </div>
    </div>
  );
}
