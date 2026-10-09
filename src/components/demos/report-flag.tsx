"use client";

import { useState } from "react";
import { Flag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const reasons = ["スパム", "ハラスメント", "誤情報", "暴力的", "性的", "その他"];

export default function ReportFlag() {
  const [sel, setSel] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  if (done) return <div className="rounded-md border bg-emerald-50 dark:bg-emerald-950/40 p-3 text-sm text-emerald-700 dark:text-emerald-300 max-w-md"><Check className="inline size-4 mr-1" />通報を受け付けました。確認後対応します。</div>;
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-sm font-medium flex items-center gap-1.5"><Flag className="size-4" />投稿を通報</div>
      <div className="space-y-1">
        {reasons.map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm cursor-pointer rounded px-2 py-1.5 hover:bg-accent">
            <input type="radio" checked={sel === r} onChange={() => setSel(r)} />
            {r}
          </label>
        ))}
      </div>
      <Button size="sm" disabled={!sel} onClick={() => setDone(true)}>通報する</Button>
    </div>
  );
}
