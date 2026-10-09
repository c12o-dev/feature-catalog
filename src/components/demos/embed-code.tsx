"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const snippet = `<iframe src="https://example.com/embed/abc"
  width="560" height="315"
  frameborder="0" allowfullscreen></iframe>`;

export default function EmbedCode() {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-sm font-medium">埋め込みコード</div>
      <pre className="rounded-md border bg-zinc-950 text-zinc-100 font-mono text-xs p-3 overflow-x-auto">{snippet}</pre>
      <Button size="sm" onClick={copy}>{copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}コピー</Button>
    </div>
  );
}
