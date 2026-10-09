"use client";

import { useState } from "react";
import { Pin, Plus } from "lucide-react";

const initial = [
  { name: "今週の Issue", count: 12, pinned: true },
  { name: "自分担当", count: 4, pinned: true },
  { name: "Backlog", count: 87, pinned: true },
  { name: "Done", count: 124, pinned: false },
];

export default function PinnedViews() {
  const [list, setList] = useState(initial);
  const pinned = list.filter((v) => v.pinned);
  const others = list.filter((v) => !v.pinned);
  const toggle = (name: string) => setList((l) => l.map((v) => v.name === name ? { ...v, pinned: !v.pinned } : v));
  return (
    <div className="space-y-3 max-w-sm">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Pinned</div>
        {pinned.map((v) => (
          <button key={v.name} onClick={() => toggle(v.name)} className="flex items-center gap-2 w-full text-left rounded px-2 py-1 hover:bg-accent">
            <Pin className="size-3 fill-amber-500 text-amber-500" />
            <span className="text-sm flex-1">{v.name}</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{v.count}</span>
          </button>
        ))}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Other</div>
        {others.map((v) => (
          <button key={v.name} onClick={() => toggle(v.name)} className="flex items-center gap-2 w-full text-left rounded px-2 py-1 hover:bg-accent group">
            <Pin className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
            <span className="text-sm flex-1">{v.name}</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{v.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
