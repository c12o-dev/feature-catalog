"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

export default function MaskedField() {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  const value = "sk-proj-9JxkZ3qP4vHmN7fWcL2bR8tA";

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2 max-w-md">
      <label className="text-sm font-medium">API キー</label>
      <div className="flex items-center gap-1 rounded-md border bg-background pl-3">
        <code className="font-mono text-sm flex-1 truncate">
          {shown ? value : "•".repeat(value.length)}
        </code>
        <button
          onClick={() => setShown((s) => !s)}
          className="p-2 text-muted-foreground hover:text-foreground"
          aria-label={shown ? "隠す" : "表示"}
        >
          {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
        <button
          onClick={copy}
          className="p-2 text-muted-foreground hover:text-foreground"
          aria-label="コピー"
        >
          {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">この値は他人に見せないでください</p>
    </div>
  );
}
