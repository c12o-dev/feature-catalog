"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DemoMode() {
  const [demo, setDemo] = useState(true);
  const items = demo
    ? [{ t: "サンプル: 案件A", s: "進行中" }, { t: "サンプル: 案件B", s: "完了" }, { t: "サンプル: 案件C", s: "未着手" }]
    : [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {demo ? <Badge variant="secondary">サンプルデータ表示中</Badge> : <Badge variant="outline">空</Badge>}
        <Button size="sm" variant="outline" onClick={() => setDemo((d) => !d)}>{demo ? "クリア" : "サンプルを読込"}</Button>
      </div>
      <div className="rounded-md border divide-y">
        {items.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">データがありません</div>
        ) : items.map((it, i) => (
          <div key={i} className="p-3 text-sm flex items-center justify-between">
            <span>{it.t}</span>
            <Badge variant="outline" className="text-[10px]">{it.s}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
