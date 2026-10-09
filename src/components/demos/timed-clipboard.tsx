"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TimedClipboard() {
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!copied) return;
    setRemaining(15);
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    const t = setTimeout(() => setCopied(false), 15000);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [copied]);
  const copy = async () => { await navigator.clipboard.writeText("super-secret-password"); setCopied(true); };
  return (
    <div className="space-y-2 max-w-md">
      <Button size="sm" onClick={copy}>{copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}パスワードをコピー</Button>
      {copied && <div className="text-xs text-amber-600">⚠ {remaining} 秒後に自動的にクリップボードから消去されます</div>}
    </div>
  );
}
