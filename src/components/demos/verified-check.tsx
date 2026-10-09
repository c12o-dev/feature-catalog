"use client";

import { BadgeCheck } from "lucide-react";

const users = [
  { name: "田中 ありさ", handle: "@arisa_t", verified: true, color: "bg-rose-400 dark:bg-rose-500" },
  { name: "ミナト書店 公式", handle: "@minato_books", verified: true, color: "bg-sky-500" },
  { name: "佐藤 かいと", handle: "@kaito_s", verified: false, color: "bg-emerald-500" },
];

export default function VerifiedCheck() {
  return (
    <ul className="mx-auto max-w-sm divide-y rounded-lg border bg-card">
      {users.map((u) => (
        <li key={u.handle} className="flex items-center gap-3 px-3 py-2.5">
          <div aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-full font-medium text-white ${u.color}`}>
            {u.name[0]}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-sm font-medium">
              <span className="truncate">{u.name}</span>
              {u.verified && (
                <span title="認証済みアカウント" className="inline-flex shrink-0">
                  <BadgeCheck aria-hidden className="size-4 fill-sky-500 text-white dark:text-background" />
                  <span className="sr-only">認証済み</span>
                </span>
              )}
            </div>
            <div className="truncate text-xs text-muted-foreground">{u.handle}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
