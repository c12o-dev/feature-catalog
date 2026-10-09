"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Check } from "lucide-react";

export default function InviteCode() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  return (
    <div className="space-y-3 max-w-md">
      <Label htmlFor="invite" className="flex items-center gap-1.5">
        <Gift className="size-4 text-pink-500" />
        紹介コード（任意）
      </Label>
      <div className="flex gap-2">
        <Input id="invite" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME2026" className="font-mono uppercase" />
        <Button onClick={() => code && setApplied(true)} disabled={!code || applied}>
          {applied ? <><Check className="size-4" />適用済</> : "適用"}
        </Button>
      </div>
      {applied && <div className="text-xs text-emerald-600">✓ {code} が適用されました</div>}
    </div>
  );
}
