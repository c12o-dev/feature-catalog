"use client";

import { useState } from "react";
import { Hash, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Channel = { name: string; members: number; unread: number; joined: boolean; topic: string; last: { who: string; text: string } };

const initial: Channel[] = [
  { name: "general", members: 124, unread: 0, joined: true, topic: "全体連絡・お知らせ", last: { who: "山本", text: "来週の全体会は 10/8 14:00 からです" } },
  { name: "engineering", members: 38, unread: 2, joined: true, topic: "開発の相談・リリース告知", last: { who: "中村", text: "v2.4 のリリースノートを上げました" } },
  { name: "design", members: 22, unread: 3, joined: true, topic: "UI レビューと素材共有", last: { who: "小林", text: "設定画面の案を 3 パターン並べました" } },
  { name: "random", members: 89, unread: 0, joined: false, topic: "雑談なんでも", last: { who: "加藤", text: "近所に新しいパン屋ができてた" } },
];

export default function GroupChannel() {
  const [channels, setChannels] = useState(initial);
  const [active, setActive] = useState("general");
  const cur = channels.find((c) => c.name === active)!;

  const open = (name: string) => {
    setActive(name);
    setChannels((cs) => cs.map((c) => (c.name === name && c.joined ? { ...c, unread: 0 } : c)));
  };

  const join = () =>
    setChannels((cs) => cs.map((c) => (c.name === active ? { ...c, joined: true, members: c.members + 1, unread: 0 } : c)));

  return (
    <div className="@container mx-auto max-w-xl overflow-hidden rounded-lg border bg-card">
      <div className="grid @md:grid-cols-[180px_1fr]">
        <nav aria-label="チャネル" className="border-b bg-muted/40 p-2 @md:border-b-0 @md:border-r">
          <div className="px-2 pb-1 text-xs font-medium text-muted-foreground">パブリックチャネル</div>
          <ul className="space-y-0.5">
            {channels.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  aria-current={active === c.name ? "page" : undefined}
                  onClick={() => open(c.name)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    active === c.name ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    !c.joined && active !== c.name && "text-muted-foreground",
                  )}
                >
                  <Hash aria-hidden className="size-4 shrink-0 opacity-70" />
                  <span className={cn("flex-1 truncate", c.unread > 0 && "font-semibold")}>{c.name}</span>
                  {c.unread > 0 && (
                    <span className="min-w-5 rounded-full bg-rose-500 px-1.5 text-center text-[10px] tabular-nums text-white">
                      {c.unread}
                      <span className="sr-only">件の未読</span>
                    </span>
                  )}
                </button>
              </li>
            ))}
            <li className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
              <Lock aria-hidden className="size-4" />
              <span className="truncate">leadership</span>
              <span className="ml-auto text-[10px]">招待制</span>
            </li>
          </ul>
        </nav>
        <section aria-live="polite" className="flex min-h-40 flex-col p-3">
          <header className="flex items-start justify-between gap-2 border-b pb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-sm font-semibold"><Hash aria-hidden className="size-4" />{cur.name}</div>
              <div className="truncate text-xs text-muted-foreground">{cur.topic}</div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
              <Users aria-hidden className="size-3.5" />{cur.members}<span className="sr-only">人のメンバー</span>
            </span>
          </header>
          <div className="flex-1 py-3 text-sm">
            <span className="font-medium">{cur.last.who}</span>
            <span className="ml-2 text-xs text-muted-foreground">09:12</span>
            <p className="text-muted-foreground">{cur.last.text}</p>
          </div>
          {cur.joined ? (
            <div className="rounded-md border px-3 py-2 text-xs text-muted-foreground">#{cur.name} へメッセージを送信</div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
              <span className="text-xs">誰でも参加できるチャネルです</span>
              <Button size="sm" onClick={join}>参加する</Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
