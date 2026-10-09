"use client";

import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const items = [
  { date: "2026-04-26", title: "ダークモード対応", tag: "新機能" },
  { date: "2026-04-22", title: "API v3 リリース", tag: "新機能" },
  { date: "2026-04-15", title: "検索パフォーマンス改善", tag: "改善" },
  { date: "2026-04-12", title: "CSV エクスポートのバグ修正", tag: "修正" },
];

export default function ChangelogPopover() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((o) => !o)} className="relative inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent">
        <Megaphone className="size-4" />What&apos;s new
        <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-md border bg-popover shadow-lg z-10">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-xs font-medium">最近の変更</span>
            <button onClick={() => setOpen(false)}><X className="size-3.5" /></button>
          </div>
          <ul className="p-2 space-y-1.5">
            {items.map((it, i) => (
              <li key={i} className="text-xs">
                <div className="flex items-center gap-1.5">
                  <Badge variant={it.tag === "新機能" ? "default" : it.tag === "修正" ? "destructive" : "secondary"} className="text-[9px]">{it.tag}</Badge>
                  <span className="text-muted-foreground">{it.date}</span>
                </div>
                <div className="mt-0.5">{it.title}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
