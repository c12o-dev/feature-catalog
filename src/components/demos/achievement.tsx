"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";

const initial = [
  { name: "初投稿", desc: "最初の投稿を作成", unlocked: true, icon: "🎉" },
  { name: "100 いいね", desc: "投稿に 100 いいね", unlocked: true, icon: "❤️" },
  { name: "1 週間連続", desc: "7 日連続でログイン", unlocked: false, icon: "🔥" },
  { name: "コラボマスター", desc: "10 人と共同作業", unlocked: false, icon: "🤝" },
];

export default function Achievement() {
  const [items, setItems] = useState(initial);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <button
            key={it.name}
            onClick={() => setItems((x) => x.map((y, j) => j === i ? { ...y, unlocked: !y.unlocked } : y))}
            className={`flex items-center gap-2 rounded-md border bg-background p-2 text-left ${it.unlocked ? "" : "opacity-50"}`}
          >
            <div className="text-2xl">{it.unlocked ? it.icon : "🔒"}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium flex items-center gap-1">{it.name}{it.unlocked && <Trophy className="size-3 text-amber-500" />}</div>
              <div className="text-[10px] text-muted-foreground">{it.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
