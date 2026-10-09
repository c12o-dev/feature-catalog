"use client";

import { useState } from "react";
import { Copy, Check, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareLink() {
  const [pub, setPub] = useState(true);
  const [copied, setCopied] = useState(false);
  const url = "https://example.com/d/8jK2mQp9X";
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-center gap-3 rounded-md border bg-background p-2 pl-3">
        <code className="flex-1 text-xs text-muted-foreground truncate">{url}</code>
        <Button size="sm" variant="ghost" onClick={copy}>{copied ? <><Check className="size-3.5 text-emerald-600" />コピー済</> : <><Copy className="size-3.5" />コピー</>}</Button>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <button onClick={() => setPub(true)} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${pub ? "bg-foreground text-background" : ""}`}>
          <Globe className="size-3.5" />リンクを知る人全員
        </button>
        <button onClick={() => setPub(false)} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${!pub ? "bg-foreground text-background" : ""}`}>
          <Lock className="size-3.5" />招待者のみ
        </button>
      </div>
    </div>
  );
}
