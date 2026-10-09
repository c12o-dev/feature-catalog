"use client";

import { useState } from "react";

const topics = ["TypeScript", "React", "AI", "Design", "Product", "Career", "Startup"];

export default function TopicFollow() {
  const [follow, setFollow] = useState<string[]>(["React", "AI"]);
  const t = (n: string) => setFollow((f) => f.includes(n) ? f.filter((x) => x !== n) : [...f, n]);
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-xs text-muted-foreground">興味のあるトピックをフォロー</div>
      <div className="flex flex-wrap gap-1.5">
        {topics.map((tp) => {
          const on = follow.includes(tp);
          return (
            <button key={tp} onClick={() => t(tp)} className={`rounded-full text-xs px-3 py-1 border ${on ? "bg-foreground text-background border-foreground" : "hover:bg-accent"}`}>
              {on ? "✓ " : "+ "}{tp}
            </button>
          );
        })}
      </div>
    </div>
  );
}
