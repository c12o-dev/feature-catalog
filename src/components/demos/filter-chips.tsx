"use client";

import { useState } from "react";
import { X } from "lucide-react";

const all = ["TypeScript", "React", "Next.js", "Tailwind", "Vite", "Zod", "TanStack", "shadcn"];

export default function FilterChips() {
  const [active, setActive] = useState<string[]>(["React", "TypeScript"]);
  const toggle = (x: string) =>
    setActive((a) => (a.includes(x) ? a.filter((y) => y !== x) : [...a, x]));
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {all.map((x) => {
          const on = active.includes(x);
          return (
            <button
              key={x}
              onClick={() => toggle(x)}
              className={`inline-flex items-center gap-1 text-xs rounded-full border px-2.5 py-1 transition-colors ${
                on ? "bg-foreground text-background border-foreground" : "hover:bg-accent"
              }`}
            >
              {x}
              {on && <X className="size-3" />}
            </button>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground">{active.length} 件選択</div>
    </div>
  );
}
