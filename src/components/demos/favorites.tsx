"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const items = [
  { name: "プロジェクト A" }, { name: "プロジェクト B" }, { name: "プロジェクト C" }, { name: "プロジェクト D" },
];

export default function Favorites() {
  const [fav, setFav] = useState<string[]>(["プロジェクト A"]);
  const toggle = (n: string) => setFav((f) => f.includes(n) ? f.filter((x) => x !== n) : [...f, n]);
  return (
    <ul className="space-y-1 max-w-sm">
      {items.map((it) => {
        const on = fav.includes(it.name);
        return (
          <li key={it.name} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
            <button onClick={() => toggle(it.name)}><Star className={`size-4 ${on ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} /></button>
            <span>{it.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
