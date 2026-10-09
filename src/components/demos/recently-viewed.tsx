"use client";

import { Clock } from "lucide-react";

const items = [
  { name: "Tailwind v4 docs", time: "2 分前" },
  { name: "shadcn/ui base-nova", time: "1 時間前" },
  { name: "Next.js 16 changelog", time: "今朝" },
  { name: "Recharts Radar example", time: "昨日" },
];

export default function RecentlyViewed() {
  return (
    <div className="space-y-2 max-w-sm">
      <div className="text-xs font-medium flex items-center gap-1.5"><Clock className="size-3.5" />最近見たもの</div>
      <ul className="rounded-md border bg-background divide-y">
        {items.map((it) => (
          <li key={it.name} className="px-3 py-1.5 flex items-center justify-between text-sm hover:bg-accent cursor-pointer">
            <span>{it.name}</span>
            <span className="text-xs text-muted-foreground">{it.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
