"use client";

import { Bell, MessageSquare, Mail, GitPullRequest } from "lucide-react";

const items = [
  { icon: Bell, count: 3 },
  { icon: MessageSquare, count: 12 },
  { icon: Mail, count: 0 },
  { icon: GitPullRequest, count: 99 },
];

export default function BadgeCounter() {
  return (
    <div className="flex items-center gap-4">
      {items.map((it, i) => (
        <button
          key={i}
          className="relative rounded-md p-2 hover:bg-accent transition-colors"
          aria-label="通知"
        >
          <it.icon className="size-5" />
          {it.count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-medium text-white grid place-items-center tabular-nums">
              {it.count > 99 ? "99+" : it.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
