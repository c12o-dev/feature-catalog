"use client";

import { useState } from "react";
import { Smile } from "lucide-react";

const groups: Record<string, string[]> = {
  Smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂"],
  Hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍"],
  Hands: ["👍", "👎", "👏", "🙌", "🤝", "🙏", "👋", "✌️"],
  Objects: ["🎉", "🚀", "🔥", "⭐", "💯", "✅", "❌", "❗"],
};

export default function EmojiPicker() {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <div className="space-y-2 max-w-xs">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="絵文字を検索..." className="w-full rounded-md border bg-background px-3 py-1.5 text-xs" />
      <div className="rounded-md border bg-background p-2 max-h-44 overflow-y-auto">
        {Object.entries(groups).map(([g, emojis]) => (
          <div key={g}>
            <div className="text-[10px] uppercase text-muted-foreground my-1">{g}</div>
            <div className="grid grid-cols-8 gap-0.5">
              {emojis.map((e) => (
                <button key={e} onClick={() => setPicked((p) => [...p, e])} className="size-7 rounded hover:bg-accent text-base">{e}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {picked.length > 0 && <div className="text-lg">{picked.join("")}</div>}
    </div>
  );
}
