"use client";

import { GitCommit, Star, Users } from "lucide-react";

const items = [
  { icon: GitCommit, label: "Commits", v: "2,841" },
  { icon: Star, label: "Stars", v: "12.3k" },
  { icon: Users, label: "Followers", v: "423" },
];

export default function StatsBadge() {
  return (
    <div className="flex gap-2">
      {items.map((it) => (
        <div key={it.label} className="rounded-md border bg-background px-3 py-2 flex items-center gap-2">
          <it.icon className="size-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-semibold tabular-nums leading-none">{it.v}</div>
            <div className="text-[10px] text-muted-foreground">{it.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
