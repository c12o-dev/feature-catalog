"use client";

import { Sparkles } from "lucide-react";

const items = [
  { title: "あなたへのおすすめ", desc: "閲覧履歴から", color: "from-purple-400 to-pink-400" },
  { title: "似た記事", desc: "見ているページと関連", color: "from-blue-400 to-cyan-400" },
  { title: "人気上昇中", desc: "今週注目", color: "from-amber-400 to-rose-400" },
];

export default function Recommendation() {
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-xs font-medium flex items-center gap-1.5"><Sparkles className="size-3.5 text-blue-500" />For You</div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((it) => (
          <div key={it.title} className="rounded-md border bg-background overflow-hidden cursor-pointer hover:border-foreground/30">
            <div className={`h-12 bg-gradient-to-br ${it.color}`} />
            <div className="p-2">
              <div className="text-xs font-medium">{it.title}</div>
              <div className="text-[10px] text-muted-foreground">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
