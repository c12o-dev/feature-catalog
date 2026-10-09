"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const items = [
  { date: "2026-04-26", title: "ダークモード対応", body: "システム設定にも追従できるようになりました", isNew: true },
  { date: "2026-04-20", title: "コマンドパレット", body: "⌘K で全機能にジャンプ" },
  { date: "2026-04-12", title: "AI Streaming", body: "回答が文字単位で流れる UI" },
];

export default function WhatsNew() {
  return (
    <div className="rounded-lg border bg-background p-3 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="size-4 text-primary" />
        <div className="text-sm font-semibold">What&apos;s new</div>
      </div>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="text-sm">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="text-xs text-muted-foreground">{it.date}</div>
              {it.isNew && <Badge variant="default" className="text-[9px]">NEW</Badge>}
            </div>
            <div className="font-medium">{it.title}</div>
            <div className="text-xs text-muted-foreground">{it.body}</div>
          </li>
        ))}
      </ul>
      <a className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
        全ての履歴 <ArrowRight className="size-3" />
      </a>
    </div>
  );
}
