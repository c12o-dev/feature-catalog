"use client";

import { useState } from "react";
import { Award, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// 架空のアワード (実在サービス・団体ではありません)
const awards = [
  {
    id: "dawn",
    icon: Trophy,
    org: "Dawn Product Awards",
    title: "今日のプロダクト 1 位",
    year: "2026",
    note: "コミュニティ投票 1,284 票で日間 1 位を獲得しました。",
  },
  {
    id: "kumo",
    icon: Medal,
    org: "雲海 SaaS レビュー",
    title: "使いやすさ部門 リーダー",
    year: "2026 春",
    note: "ユーザーレビュー 312 件の満足度 4.7 / 5 に基づく評価です。",
  },
  {
    id: "hoshi",
    icon: Award,
    org: "星図デザイン賞",
    title: "UI デザイン 優秀賞",
    year: "2025",
    note: "審査員 9 名による選考で、情報設計とアクセシビリティが評価されました。",
  },
];

export default function AwardBadge() {
  const [active, setActive] = useState<string | null>(null);
  const current = awards.find((a) => a.id === active);

  return (
    <div className="@container mx-auto w-full max-w-2xl space-y-3">
      <div className="text-center">
        <p className="text-xs text-muted-foreground">チームのためのタスク管理</p>
        <p className="text-sm font-semibold">Hikari Board</p>
      </div>
      <ul className="grid grid-cols-1 gap-2 @md:grid-cols-3">
        {awards.map((a) => {
          const Icon = a.icon;
          const on = active === a.id;
          return (
            <li key={a.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setActive(on ? null : a.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring @md:flex-col @md:gap-1.5 @md:text-center",
                  on && "border-amber-500/60 dark:border-amber-400/60",
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">{a.org}</span>
                  <span className="block text-sm font-semibold">{a.title}</span>
                  <span className="block text-xs text-muted-foreground tabular-nums">{a.year}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="min-h-10 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        {current ? current.note : "バッジを選ぶと受賞の根拠を表示します。"}
      </p>
    </div>
  );
}
