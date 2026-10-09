"use client";

import { GitCommit, GitPullRequest, MessageSquare, Star, GitBranch } from "lucide-react";

const events = [
  { icon: GitCommit, color: "text-blue-500", text: "Commit: Refactor user service", time: "5分前" },
  { icon: GitPullRequest, color: "text-purple-500", text: "Opened PR #284: Add command palette", time: "1時間前" },
  { icon: MessageSquare, color: "text-emerald-500", text: "Commented on issue #92", time: "3時間前" },
  { icon: Star, color: "text-amber-500", text: "Starred shadcn/ui", time: "昨日" },
  { icon: GitBranch, color: "text-rose-500", text: "Created branch feat/streaming-ui", time: "2日前" },
];

export default function ActivityFeed() {
  return (
    <ol className="space-y-3 max-w-md">
      {events.map((e, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <e.icon className={`size-4 mt-0.5 ${e.color}`} />
          <div className="flex-1 min-w-0">
            <div>{e.text}</div>
            <div className="text-xs text-muted-foreground">{e.time}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
