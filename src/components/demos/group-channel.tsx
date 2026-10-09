"use client";

import { Hash, Users } from "lucide-react";

const channels = [
  { name: "general", count: 124 },
  { name: "engineering", count: 38 },
  { name: "design", count: 22, unread: 3 },
  { name: "random", count: 89 },
];

export default function GroupChannel() {
  return (
    <ul className="rounded-md border bg-background divide-y max-w-sm">
      {channels.map((c) => (
        <li key={c.name} className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer">
          <Hash className="size-4 text-muted-foreground" />
          <span className={`flex-1 text-sm ${c.unread ? "font-semibold" : ""}`}>{c.name}</span>
          {c.unread && <span className="rounded-full bg-red-500 text-white text-[10px] tabular-nums px-1.5 min-w-[1rem] text-center">{c.unread}</span>}
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Users className="size-3" />{c.count}</span>
        </li>
      ))}
    </ul>
  );
}
