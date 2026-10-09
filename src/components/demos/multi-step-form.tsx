"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = ["基本情報", "詳細", "確認"];

export default function MultiStepForm() {
  const [s, setS] = useState(0);
  const [data, setData] = useState({ name: "", email: "", company: "" });
  return (
    <div className="space-y-3 max-w-md">
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${((s + 1) / steps.length) * 100}%` }} />
      </div>
      <div className="text-xs text-muted-foreground">{s + 1} / {steps.length}: {steps[s]}</div>
      {s === 0 && (
        <div className="space-y-2">
          <Label>名前</Label>
          <Input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} />
          <Label>メール</Label>
          <Input type="email" value={data.email} onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))} />
        </div>
      )}
      {s === 1 && (
        <div className="space-y-2">
          <Label>会社名 (任意)</Label>
          <Input value={data.company} onChange={(e) => setData((d) => ({ ...d, company: e.target.value }))} />
        </div>
      )}
      {s === 2 && (
        <div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
          <div>名前: {data.name || "—"}</div>
          <div>メール: {data.email || "—"}</div>
          <div>会社: {data.company || "—"}</div>
        </div>
      )}
      <div className="flex justify-between">
        <Button size="sm" variant="ghost" onClick={() => setS((x) => Math.max(0, x - 1))} disabled={s === 0}>戻る</Button>
        <Button size="sm" onClick={() => setS((x) => Math.min(steps.length - 1, x + 1))} disabled={s === steps.length - 1}>次へ</Button>
      </div>
    </div>
  );
}
