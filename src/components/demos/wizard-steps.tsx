"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { label: "カート", body: "商品 3 点 · 小計 ¥12,800" },
  { label: "配送先", body: "東京都渋谷区神南 1-2-3 · 山田 花子" },
  { label: "支払い", body: "クレジットカード •••• 4242" },
  { label: "確認", body: "内容を確認して注文を確定してください" },
];

export default function WizardSteps() {
  const [s, setS] = useState(1);
  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium">{steps[s].label}</span>
        <span className="text-muted-foreground tabular-nums" aria-live="polite">
          ステップ {s + 1} / {steps.length}
        </span>
      </div>
      <ol className="flex items-start" aria-label="注文手続きの進捗">
        {steps.map((st, i) => {
          const done = i < s;
          const current = i === s;
          return (
            <li key={st.label} className="flex flex-1 items-start last:flex-none" aria-current={current ? "step" : undefined}>
              <div className="flex w-12 flex-col items-center text-center">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-xs font-medium tabular-nums",
                    done && "bg-primary/15 text-primary",
                    current && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                    !done && !current && "border bg-background text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </span>
                <span className={cn("mt-1 text-[10px]", current ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {st.label}
                  {done && <span className="sr-only">（完了）</span>}
                </span>
              </div>
              {i < steps.length - 1 && <div aria-hidden className={cn("mt-3.5 h-px flex-1", done ? "bg-primary" : "bg-border")} />}
            </li>
          );
        })}
      </ol>
      <div className="rounded-md border bg-card px-3 py-3 text-sm">{steps[s].body}</div>
      <div className="flex justify-between">
        <Button size="sm" variant="outline" onClick={() => setS((v) => Math.max(0, v - 1))} disabled={s === 0}>
          戻る
        </Button>
        <Button size="sm" onClick={() => setS((v) => (v === steps.length - 1 ? 0 : v + 1))}>
          {s === steps.length - 1 ? "注文を確定" : "次へ"}
        </Button>
      </div>
    </div>
  );
}
