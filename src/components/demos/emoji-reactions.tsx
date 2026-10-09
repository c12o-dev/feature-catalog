"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

type Reaction = { emoji: string; count: number; me: boolean };
const initial: Reaction[] = [
  { emoji: "👍", count: 5, me: true },
  { emoji: "🎉", count: 3, me: false },
  { emoji: "❤️", count: 2, me: false },
];

export default function EmojiReactions() {
  const [r, setR] = useState(initial);
  const [open, setOpen] = useState(false);
  const palette = ["😀", "😂", "🚀", "🔥", "👀", "💯"];
  const toggle = (emoji: string) => setR((rs) => {
    const ex = rs.find((x) => x.emoji === emoji);
    if (ex) return rs.map((x) => x.emoji === emoji ? { ...x, count: x.count + (x.me ? -1 : 1), me: !x.me } : x).filter((x) => x.count > 0);
    return [...rs, { emoji, count: 1, me: true }];
  });
  return (
    <div className="space-y-2 max-w-sm">
      <div className="rounded-md border bg-background p-3 text-sm">これは投稿です。リアクションを送ってください。</div>
      <div className="flex flex-wrap items-center gap-1.5">
        {r.map((x) => (
          <button key={x.emoji} onClick={() => toggle(x.emoji)} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${x.me ? "border-primary bg-primary/10" : "hover:bg-accent"}`}>
            {x.emoji} {x.count}
          </button>
        ))}
        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center rounded-full border px-2 py-1 text-xs hover:bg-accent"><Plus className="size-3" /></button>
          {open && (
            <div className="absolute left-0 top-full mt-1 rounded-md border bg-popover p-1 shadow-md z-10 flex gap-0.5">
              {palette.map((e) => <button key={e} onClick={() => { toggle(e); setOpen(false); }} className="size-7 rounded hover:bg-accent">{e}</button>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
