"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const apps = [
  { name: "Slack", desc: "通知をチャンネルに送信", connected: true },
  { name: "GitHub", desc: "PR の状況を同期", connected: true },
  { name: "Linear", desc: "イシュー作成", connected: false },
  { name: "Stripe", desc: "課金イベントを受信", connected: false },
];

export default function Integrations() {
  const [list, setList] = useState(apps);
  const toggle = (n: string) => setList((l) => l.map((a) => a.name === n ? { ...a, connected: !a.connected } : a));
  return (
    <div className="space-y-2">
      {list.map((a) => (
        <div key={a.name} className="flex items-center gap-3 rounded-md border bg-background p-3">
          <div className="size-8 rounded bg-muted grid place-items-center text-xs font-medium">{a.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{a.name}</div>
            <div className="text-xs text-muted-foreground">{a.desc}</div>
          </div>
          <Button size="sm" variant={a.connected ? "outline" : "default"} onClick={() => toggle(a.name)}>
            {a.connected ? <><Check className="size-3.5" />接続済</> : "接続"}
          </Button>
        </div>
      ))}
    </div>
  );
}
