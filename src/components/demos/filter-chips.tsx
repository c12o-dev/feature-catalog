"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TAGS = ["TypeScript", "React", "CSS", "テスト", "パフォーマンス", "アクセシビリティ"];

const POSTS = [
  { title: "型で守る API クライアント", tags: ["TypeScript", "テスト"] },
  { title: "useTransition で入力を軽くする", tags: ["React", "パフォーマンス"] },
  { title: "フォーカスリングを消さない CSS", tags: ["CSS", "アクセシビリティ"] },
  { title: "コンポーネントのテスト戦略", tags: ["React", "テスト", "TypeScript"] },
  { title: "コンテナクエリ実践", tags: ["CSS"] },
  { title: "読み上げに配慮したモーダル", tags: ["React", "アクセシビリティ"] },
];

export default function FilterChips() {
  const [active, setActive] = useState<string[]>(["React"]);
  const toggle = (x: string) => setActive((a) => (a.includes(x) ? a.filter((y) => y !== x) : [...a, x]));
  // AND: a post must carry every selected tag
  const results = POSTS.filter((p) => active.every((t) => p.tags.includes(t)));

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div role="group" aria-label="タグで絞り込む" className="flex flex-wrap gap-1.5">
        {TAGS.map((x) => {
          const on = active.includes(x);
          return (
            <button
              key={x}
              type="button"
              onClick={() => toggle(x)}
              aria-pressed={on}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
                on ? "border-foreground bg-foreground text-background" : "bg-background hover:bg-muted",
              )}
            >
              {on && <Check className="size-3" aria-hidden />}
              {x}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex min-h-11 flex-wrap items-center gap-1.5 border-b px-3 py-2">
          <span className="text-xs text-muted-foreground">適用中:</span>
          {active.length === 0 && <span className="text-xs text-muted-foreground">なし</span>}
          {active.map((t) => (
            <span key={t} className="inline-flex items-center gap-0.5 rounded-md bg-muted py-0.5 pl-2 pr-0.5 text-xs">
              {t}
              <button
                type="button"
                onClick={() => toggle(t)}
                aria-label={`${t} の絞り込みを解除`}
                className="grid size-4 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          {active.length > 1 && (
            <button type="button" onClick={() => setActive([])} className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
              すべて解除
            </button>
          )}
        </div>
        <p className="px-3 pt-2 text-xs text-muted-foreground tabular-nums" aria-live="polite">
          {results.length} 件の記事
        </p>
        <ul className="divide-y px-3 pb-1">
          {results.map((p) => (
            <li key={p.title} className="flex flex-wrap items-baseline justify-between gap-x-2 py-2">
              <span className="text-sm">{p.title}</span>
              <span className="text-[11px] text-muted-foreground">{p.tags.join(" · ")}</span>
            </li>
          ))}
          {results.length === 0 && <li className="py-4 text-center text-xs text-muted-foreground">条件に合う記事がありません</li>}
        </ul>
      </div>
    </div>
  );
}
