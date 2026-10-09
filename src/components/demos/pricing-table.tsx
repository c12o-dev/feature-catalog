"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plans = [
  { name: "Free", monthly: 0, yearly: 0, features: ["1 プロジェクト", "100 MB ストレージ", "コミュニティサポート"] },
  { name: "Pro", monthly: 1200, yearly: 12000, popular: true, features: ["無制限プロジェクト", "10 GB ストレージ", "メールサポート", "高度な分析"] },
  { name: "Team", monthly: 4800, yearly: 48000, features: ["チーム招待", "100 GB ストレージ", "優先サポート", "SSO", "監査ログ"] },
];

const cycles = [
  { id: "monthly", label: "月額" },
  { id: "yearly", label: "年額" },
] as const;

type Cycle = (typeof cycles)[number]["id"];

export default function PricingTable() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const yearly = cycle === "yearly";

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const idx = cycles.findIndex((c) => c.id === cycle);
    let next = idx;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = cycles.length - 1;
    else next = (idx + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + cycles.length) % cycles.length;
    setCycle(cycles[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="@container w-full space-y-4">
      <div className="flex justify-center">
        <div
          role="radiogroup"
          aria-label="請求サイクル"
          onKeyDown={onKeyDown}
          className="inline-flex rounded-lg bg-muted p-1 text-sm"
        >
          {cycles.map((c, i) => {
            const on = cycle === c.id;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                onClick={() => setCycle(c.id)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "bg-background shadow-sm" : "text-muted-foreground",
                )}
              >
                {c.label}
                {c.id === "yearly" && (
                  <Badge variant="secondary" className="text-[10px]">
                    2 ヶ月分 OFF
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 @2xl:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={cn("rounded-lg border bg-card p-4", p.popular && "border-foreground ring-2 ring-foreground/15")}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">{p.name}</div>
              {p.popular && <Badge>人気</Badge>}
            </div>
            <div aria-live="polite" className="text-2xl font-semibold tabular-nums">
              ¥{(yearly ? p.yearly : p.monthly).toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/{yearly ? "年" : "月"}</span>
            </div>
            <div className="h-4 text-xs text-muted-foreground tabular-nums">
              {yearly && p.yearly > 0 ? `月あたり ¥${Math.round(p.yearly / 12).toLocaleString()}` : ""}
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
