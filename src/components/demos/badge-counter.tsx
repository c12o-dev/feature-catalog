"use client";

import { useState } from "react";
import { Bell, MessageSquare, Mail, GitPullRequest, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const kinds = [
  { key: "notify", label: "通知", icon: Bell },
  { key: "chat", label: "メッセージ", icon: MessageSquare },
  { key: "mail", label: "メール", icon: Mail },
  { key: "pr", label: "レビュー依頼", icon: GitPullRequest },
] as const;

type Key = (typeof kinds)[number]["key"];

const display = (n: number) => (n > 99 ? "99+" : String(n));

export default function BadgeCounter() {
  const [counts, setCounts] = useState<Record<Key, number>>({ notify: 3, chat: 12, mail: 0, pr: 104 });
  const [last, setLast] = useState("");

  const open = (k: Key, label: string) => {
    setCounts((c) => ({ ...c, [k]: 0 }));
    setLast(`${label}を開きました`);
  };
  const receive = () => {
    setCounts((c) => ({ ...c, notify: c.notify + 1, mail: c.mail + 1 }));
    setLast("新着: 通知 1 件、メール 1 件");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {kinds.map((k) => {
          const n = counts[k.key];
          return (
            <button
              key={k.key}
              type="button"
              onClick={() => open(k.key, k.label)}
              className="relative rounded-md p-2.5 text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              aria-label={n > 0 ? `${k.label}（未読 ${n > 99 ? "99 件以上" : `${n} 件`}）` : `${k.label}（未読なし）`}
            >
              <k.icon className="size-5" aria-hidden />
              {n > 0 && (
                <span
                  aria-hidden
                  className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white tabular-nums ring-2 ring-background dark:bg-red-500"
                >
                  {display(n)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={receive}>
          <Plus className="size-3.5" />
          新着を受信
        </Button>
        <span aria-live="polite" className="text-xs text-muted-foreground">
          {last || "アイコンを押すと既読になります"}
        </span>
      </div>
    </div>
  );
}
