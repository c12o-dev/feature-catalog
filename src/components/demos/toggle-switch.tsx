"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ToggleSwitch() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  return (
    <div className="space-y-3 max-w-sm">
      <Row label="メール通知" v={a} on={setA} />
      <Row label="マーケティング情報" v={b} on={setB} />
      <Row label="アクティビティのまとめ" v={c} on={setC} />
    </div>
  );
}

function Row({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <Switch checked={v} onCheckedChange={on} />
    </div>
  );
}
