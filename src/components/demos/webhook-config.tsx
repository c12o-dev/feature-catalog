"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

const events = ["user.created", "order.paid", "subscription.cancelled"];

export default function WebhookConfig() {
  const [url, setUrl] = useState("https://api.example.com/webhooks/in");
  const [sel, setSel] = useState<string[]>(["user.created", "order.paid"]);
  const t = (e: string) => setSel((s) => s.includes(e) ? s.filter((x) => x !== e) : [...s, e]);
  return (
    <div className="space-y-3 max-w-md">
      <div>
        <Label className="text-xs">エンドポイント URL</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono text-xs" />
      </div>
      <div>
        <Label className="text-xs">イベント</Label>
        <div className="space-y-1 mt-1">
          {events.map((e) => (
            <label key={e} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={sel.includes(e)} onChange={() => t(e)} />
              <code className="text-xs">{e}</code>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm">保存</Button>
        <Button size="sm" variant="outline"><Send className="size-3.5" />テスト送信</Button>
      </div>
    </div>
  );
}
