"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

const quests = [
  { name: "10 分間レッスン", reward: "+10 XP", done: true },
  { name: "新しい単語 5 つ", reward: "+15 XP", done: true },
  { name: "1 つの実例文を作る", reward: "+20 XP", done: false },
  { name: "Bonus: 連続記録維持", reward: "+50 XP", done: false },
];

export default function DailyQuest() {
  const [list, setList] = useState(quests);
  const done = list.filter((q) => q.done).length;
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-sm font-medium flex items-center justify-between">
        <span>今日のクエスト</span>
        <span className="text-xs text-muted-foreground tabular-nums">{done}/{list.length}</span>
      </div>
      <ul className="space-y-1">
        {list.map((q, i) => (
          <li key={q.name}>
            <button onClick={() => setList((l) => l.map((x, j) => j === i ? { ...x, done: !x.done } : x))} className="w-full flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent">
              {q.done ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Circle className="size-4 text-muted-foreground" />}
              <span className={`flex-1 text-left ${q.done ? "line-through text-muted-foreground" : ""}`}>{q.name}</span>
              <span className="text-xs text-amber-600 font-medium">{q.reward}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
