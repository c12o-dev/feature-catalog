"use client";

import { useState } from "react";

const initial = [
  { id: 1, title: "PR #284 がマージされました", read: false },
  { id: 2, title: "新しいコメント from Alice", read: false },
  { id: 3, title: "週次レポート 2026-04-22", read: true },
  { id: 4, title: "ストレージ容量警告", read: false },
];

export default function ReadUnread() {
  const [list, setList] = useState(initial);
  const unread = list.filter((x) => !x.read).length;
  return (
    <div className="space-y-2 max-w-md">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{unread} 件未読</span>
        <button onClick={() => setList((l) => l.map((x) => ({ ...x, read: true })))} className="text-xs text-primary hover:underline">すべて既読</button>
      </div>
      <ul className="rounded-md border bg-background divide-y">
        {list.map((it) => (
          <li
            key={it.id}
            onClick={() => setList((l) => l.map((x) => x.id === it.id ? { ...x, read: !x.read } : x))}
            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent ${!it.read ? "font-medium" : "text-muted-foreground"}`}
          >
            <div className={`size-2 rounded-full ${it.read ? "bg-transparent" : "bg-blue-500"}`} />
            <span>{it.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
