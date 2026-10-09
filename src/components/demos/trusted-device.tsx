"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function TrustedDevice() {
  const [trust, setTrust] = useState(false);
  return (
    <div className="rounded-md border bg-background p-3 max-w-md">
      <div className="text-sm">確認コード入力</div>
      <input className="mt-2 w-full rounded-md border bg-background px-3 py-1.5 text-sm font-mono text-center" placeholder="6 桁コード" />
      <label className="flex items-center gap-2 text-xs mt-3 cursor-pointer">
        <Switch checked={trust} onCheckedChange={setTrust} />
        この端末を信頼する (次回から OTP 不要)
      </label>
      {trust && <div className="text-[10px] text-amber-600 mt-1">⚠ 共有端末では使用しないでください</div>}
    </div>
  );
}
