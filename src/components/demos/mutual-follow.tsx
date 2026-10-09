"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const initial = [
  { id: "aoi", name: "佐藤 葵", handle: "aoi_sato", tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300", followsYou: true, following: true },
  { id: "ren", name: "高橋 蓮", handle: "ren_t", tone: "bg-blue-500/15 text-blue-700 dark:text-blue-300", followsYou: true, following: false },
  { id: "mio", name: "伊藤 澪", handle: "mio_ito", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", followsYou: false, following: true },
  { id: "sou", name: "中村 颯", handle: "sou_n", tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300", followsYou: false, following: false },
];

export default function MutualFollow() {
  const [people, setPeople] = useState(initial);
  const [status, setStatus] = useState("");

  const toggle = (id: string) => {
    const p = people.find((x) => x.id === id);
    if (!p) return;
    const following = !p.following;
    setPeople((prev) => prev.map((x) => (x.id === id ? { ...x, following } : x)));
    setStatus(
      following
        ? `${p.name} さんをフォローしました${p.followsYou ? "。相互フォローになりました" : ""}`
        : `${p.name} さんのフォローを解除しました`,
    );
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <ul className="divide-y rounded-lg border bg-card">
        {people.map((p) => {
          const mutual = p.followsYou && p.following;
          return (
            <li key={p.id} className="flex items-center gap-3 px-3 py-2.5">
              <div className={cn("grid size-9 shrink-0 place-items-center rounded-full text-sm font-medium", p.tone)} aria-hidden>
                {p.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span className="truncate text-sm font-medium">{p.name}</span>
                  {mutual ? (
                    <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                      <ArrowLeftRight className="size-3" aria-hidden />
                      相互フォロー
                    </span>
                  ) : p.followsYou ? (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">フォローされています</span>
                  ) : null}
                </div>
                <div className="truncate text-xs text-muted-foreground">@{p.handle}</div>
              </div>
              <button
                type="button"
                aria-pressed={p.following}
                aria-label={`${p.name} さんを${p.following ? "フォロー中 (押すと解除)" : "フォローする"}`}
                onClick={() => toggle(p.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  p.following ? "border bg-background hover:bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {p.following ? "フォロー中" : p.followsYou ? "フォローバック" : "フォロー"}
              </button>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  );
}
