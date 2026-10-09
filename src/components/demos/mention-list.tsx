"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

const mentions = [
  { user: "Alice", where: "PR #284", when: "5分前", text: "@you レビューお願いします" },
  { user: "Bob", where: "#engineering", when: "1時間前", text: "@you の意見も聞きたい" },
  { user: "Carol", where: "Doc: Q1 戦略", when: "昨日", text: "@you ここの数字を確認して" },
];

export default function MentionList() {
  const [unread, setUnread] = useState(true);
  return (
    <div className="rounded-md border bg-background overflow-hidden max-w-md">
      <div className="px-3 py-2 text-xs font-medium border-b bg-muted/30 flex items-center justify-between">
        <span className="flex items-center gap-1.5"><Bell className="size-3.5" />メンション</span>
        {unread && <button onClick={() => setUnread(false)} className="text-xs text-primary hover:underline">すべて既読</button>}
      </div>
      <ul className="divide-y">
        {mentions.map((m, i) => (
          <li key={i} className={`px-3 py-2 text-sm ${unread && i === 0 ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{m.user}</span>in<span>{m.where}</span>·<span>{m.when}</span>
            </div>
            <div className="mt-0.5">{m.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
