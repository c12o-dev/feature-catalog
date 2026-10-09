"use client";

import { Badge } from "@/components/ui/badge";

const people = [
  { name: "Alice", color: "bg-rose-400", mutual: true },
  { name: "Bob", color: "bg-blue-400", mutual: false },
  { name: "Carol", color: "bg-emerald-400", mutual: true },
];

export default function MutualFollow() {
  return (
    <ul className="space-y-2">
      {people.map((p) => (
        <li key={p.name} className="flex items-center gap-2 rounded-md border bg-background p-2">
          <div className={`size-9 rounded-full ${p.color} grid place-items-center text-white font-medium`}>{p.name[0]}</div>
          <div className="flex-1">
            <div className="text-sm font-medium flex items-center gap-1.5">
              {p.name}
              {p.mutual && <Badge variant="secondary" className="text-[10px]">フォロー中</Badge>}
            </div>
            <div className="text-xs text-muted-foreground">{p.mutual ? "あなたをフォローしています" : ""}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
