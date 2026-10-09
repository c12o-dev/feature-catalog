"use client";

import { useState } from "react";
import { Copy, Check, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RouteShare() {
  const [copied, setCopied] = useState(false);
  const url = "https://maps.example.com/?from=35.689,139.692&to=35.658,139.745";
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div className="space-y-2 max-w-md">
      <div className="flex items-center gap-1.5 text-sm font-medium"><Share className="size-4" />経路をシェア</div>
      <div className="flex items-center gap-2 rounded-md border bg-background p-2 pl-3">
        <code className="flex-1 text-xs text-muted-foreground truncate">{url}</code>
        <Button size="sm" variant="outline" onClick={copy}>{copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}</Button>
      </div>
    </div>
  );
}
