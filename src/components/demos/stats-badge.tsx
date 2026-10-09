"use client";

import { useState } from "react";
import { Flame, GitCommitHorizontal, GitPullRequest, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "year" | "all";

const STATS: Record<Period, { commits: string; prs: string; stars: string; streak: number; best: number }> = {
  year: { commits: "1,284", prs: "86", stars: "2.1k", streak: 23, best: 41 },
  all: { commits: "6,912", prs: "418", stars: "12.3k", streak: 23, best: 97 },
};

// 12 週 × 7 日の活動量（seed 固定の擬似乱数）
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261001);
const WEEKS = 12;
const ACTIVITY = Array.from({ length: WEEKS * 7 }, (_, i) => {
  // 直近 23 日は必ず 1 以上（連続記録）
  const recent = i >= WEEKS * 7 - 23;
  const r = rand();
  if (recent) return 1 + Math.floor(r * 4);
  return r < 0.3 ? 0 : Math.floor(r * 5);
});

const LEVEL = [
  "bg-muted",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-700 dark:bg-emerald-300",
];

export default function StatsBadge() {
  const [period, setPeriod] = useState<Period>("year");
  const s = STATS[period];
  const tiles = [
    { icon: GitCommitHorizontal, label: "コミット", v: s.commits },
    { icon: GitPullRequest, label: "PR", v: s.prs },
    { icon: Star, label: "スター", v: s.stars },
  ];

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div aria-hidden className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold">
            ハ
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium leading-tight">春野ひより</div>
            <div className="text-xs text-muted-foreground">@hiyori-dev</div>
          </div>
        </div>
        <div role="group" aria-label="集計期間" className="inline-flex rounded-md border p-0.5 text-xs">
          {(["year", "all"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p === "year" ? "今年" : "全期間"}
            </button>
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-md border bg-background px-3 py-2">
            <dt className="flex items-center gap-1 text-xs text-muted-foreground">
              <t.icon aria-hidden className="size-3.5" />
              {t.label}
            </dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums leading-tight">{t.v}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md bg-muted/60 px-3 py-2 text-xs">
        <span className="flex items-center gap-1 font-medium">
          <Flame aria-hidden className="size-4 text-orange-500 dark:text-orange-400" />
          <span className="tabular-nums">{s.streak}</span> 日連続
        </span>
        <span className="text-muted-foreground">
          最長 <span className="tabular-nums">{s.best}</span> 日
        </span>
      </div>

      <div>
        <div className="mb-1 text-xs text-muted-foreground">直近 12 週の活動</div>
        <div
          role="img"
          aria-label={`直近 12 週の活動。${s.streak} 日連続でコミット中`}
          className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-x-auto"
          style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
        >
          {ACTIVITY.map((lv, i) => (
            <span key={i} className={cn("aspect-square rounded-[2px]", LEVEL[lv])} />
          ))}
        </div>
      </div>
    </div>
  );
}
