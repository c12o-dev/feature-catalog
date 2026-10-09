"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const items = ["TypeScript", "Type alias", "type parameter", "tuple", "TanStack Table", "TanStack Query", "Tremor", "Tailwind v4"];

export default function TypeaheadSearch() {
  const [q, setQ] = useState("");
  const filtered = q ? items.filter((i) => i.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <div className="max-w-md space-y-2">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="入力中に候補表示..." />
      </div>
      {filtered.length > 0 && (
        <ul className="rounded-md border bg-background overflow-hidden divide-y">
          {filtered.map((i) => (
            <li key={i} className="px-3 py-2 text-sm hover:bg-accent cursor-pointer">
              {i.split(new RegExp(`(${q})`, "i")).map((part, idx) =>
                part.toLowerCase() === q.toLowerCase() ? <mark key={idx} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> : part
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
