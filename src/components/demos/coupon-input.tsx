"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";

export default function CouponInput() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apply = () => {
    if (code.toUpperCase() === "WELCOME20") { setApplied("WELCOME20"); setError(null); }
    else { setError("無効なコードです"); setApplied(null); }
  };
  return (
    <div className="space-y-2 max-w-md">
      <Tag className="size-4 inline mr-1.5" /><span className="text-sm font-medium">プロモコード</span>
      <div className="flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME20" className="font-mono" />
        <Button onClick={apply} disabled={!code}>適用</Button>
      </div>
      {applied && <div className="text-xs text-emerald-600">✓ {applied} を適用しました（−20%）</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
