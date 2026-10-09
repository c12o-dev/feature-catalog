"use client";

import { Bell, GitPullRequest, MessageSquare, AlertCircle } from "lucide-react";

const items = [
  { icon: GitPullRequest, color: "text-purple-500", who: "Alice", what: "が PR #284 を作成", time: "5 分前", unread: true },
  { icon: MessageSquare, color: "text-blue-500", who: "Bob", what: "がコメント: \"いいですね\"", time: "1 時間前", unread: true },
  { icon: AlertCircle, color: "text-amber-500", who: "システム", what: ": ストレージ残量 80%", time: "3 時間前", unread: false },
  { icon: GitPullRequest, color: "text-emerald-500", who: "Carol", what: "が PR #281 をマージ", time: "昨日", unread: false },
];

export default function NotificationCenter() {
  return (
    <div className="rounded-md border bg-background overflow-hidden max-w-md">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <span className="text-xs font-medium flex items-center gap-1.5"><Bell className="size-3.5" />通知</span>
        <button className="text-xs text-primary hover:underline">すべて既読</button>
      </div>
      <ul className="divide-y">
        {items.map((it, i) => (
          <li key={i} className={`flex items-start gap-3 px-3 py-2.5 text-sm ${it.unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
            <it.icon className={`size-4 mt-0.5 ${it.color}`} />
            <div className="flex-1 min-w-0">
              <div><span className="font-medium">{it.who}</span> <span className="text-muted-foreground">{it.what}</span></div>
              <div className="text-xs text-muted-foreground">{it.time}</div>
            </div>
            {it.unread && <div className="size-2 rounded-full bg-blue-500" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
