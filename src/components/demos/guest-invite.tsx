"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Copy, Check } from "lucide-react";

export default function GuestInvite() {
  const [exp, setExp] = useState("7d");
  const [copied, setCopied] = useState(false);
  const url = "https://example.com/g/Xq9k4P2nM";
  const opts = [{ v: "1h", l: "1 時間" }, { v: "1d", l: "1 日" }, { v: "7d", l: "7 日" }, { v: "0", l: "無期限" }];
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-sm font-medium flex items-center gap-1.5"><Clock className="size-4" />ゲスト招待リンク</div>
      <div className="flex gap-1.5 flex-wrap">
        {opts.map((o) => (
          <button key={o.v} onClick={() => setExp(o.v)} className={`text-xs rounded-md border px-2 py-1 ${exp === o.v ? "bg-foreground text-background" : ""}`}>
            {o.l}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-md border bg-background p-2 pl-3">
        <code className="flex-1 text-xs text-muted-foreground truncate">{url}</code>
        <Button size="xs" variant="outline" onClick={copy}>{copied ? <Check className="size-3" /> : <Copy className="size-3" />}</Button>
      </div>
      <div className="text-xs text-muted-foreground">{exp === "0" ? "期限なし" : `期限: ${opts.find((o) => o.v === exp)?.l} 後に無効化`}</div>
    </div>
  );
}
