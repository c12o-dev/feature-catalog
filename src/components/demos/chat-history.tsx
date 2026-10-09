"use client";

import { useState } from "react";
import { MessageSquare, GitBranch } from "lucide-react";

const sessions = [
  { id: 1, title: "Tailwind v4 の設定方法", count: 8 },
  { id: 2, title: "Next.js 16 RSC とは", count: 4 },
  { id: 3, title: "shadcn/ui base-nova preset", count: 12 },
  { id: 4, title: "Zod v4 のスキーマ", count: 3 },
];

export default function ChatHistory() {
  const [active, setActive] = useState(1);
  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <div className="px-3 py-2 text-xs font-medium border-b bg-muted/30">チャット履歴</div>
      <ul className="divide-y">
        {sessions.map((s) => (
          <li key={s.id}>
            <button onClick={() => setActive(s.id)} className={`w-full text-left px-3 py-2 flex items-center gap-2 text-xs hover:bg-accent ${active === s.id ? "bg-accent" : ""}`}>
              <MessageSquare className="size-3.5 text-muted-foreground" />
              <span className="flex-1 truncate">{s.title}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{s.count}</span>
              <GitBranch className="size-3 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
