"use client";

import { useId, useState } from "react";
import { AlertTriangle, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { key: string; label: string; used: number; max: number; unit?: string; step: number; fmt: (n: number) => string };

const int = (n: number) => n.toLocaleString("ja-JP");
const gb = (n: number) => n.toFixed(1);

const INITIAL: Item[] = [
  { key: "api", label: "API リクエスト", used: 7_800, max: 10_000, step: 600, fmt: int },
  { key: "storage", label: "ストレージ", used: 4.2, max: 10, unit: "GB", step: 1.1, fmt: gb },
  { key: "seats", label: "メンバー", used: 8, max: 25, unit: "人", step: 3, fmt: int },
];

function level(pct: number) {
  if (pct >= 100) return "over";
  if (pct >= 80) return "warn";
  return "ok";
}

export default function UsageMeter() {
  const [items, setItems] = useState(INITIAL);
  const uid = useId();
  const bump = (key: string) =>
    setItems((xs) => xs.map((x) => (x.key === key ? { ...x, used: Math.min(x.max, Math.round((x.used + x.step) * 10) / 10) } : x)));

  const alerts = items.filter((x) => level((x.used / x.max) * 100) !== "ok");

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-sm font-medium">今月の利用量</div>
          <div className="text-xs text-muted-foreground">Pro プラン · 10/1〜10/31</div>
        </div>
        <button
          type="button"
          onClick={() => setItems(INITIAL)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RotateCcw aria-hidden className="size-3" />
          リセット
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((it) => {
          const pct = Math.min(100, (it.used / it.max) * 100);
          const lv = level(pct);
          const unit = it.unit ?? "";
          const valueText = `${it.fmt(it.used)}${unit} / ${it.fmt(it.max)}${unit}（${Math.round(pct)}%）`;
          return (
            <li key={it.key}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                <span id={`${uid}-${it.key}`} className="font-medium">
                  {it.label}
                </span>
                <span className={cn("tabular-nums", lv === "ok" ? "text-muted-foreground" : "text-amber-700 dark:text-amber-400", lv === "over" && "text-destructive dark:text-destructive")}>
                  {it.fmt(it.used)}
                  {unit} / {it.fmt(it.max)}
                  {unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  role="meter"
                  aria-labelledby={`${uid}-${it.key}`}
                  aria-valuemin={0}
                  aria-valuemax={it.max}
                  aria-valuenow={it.used}
                  aria-valuetext={valueText}
                  className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 w-full origin-left rounded-full transition-transform duration-500",
                      lv === "ok" && "bg-primary",
                      lv === "warn" && "bg-amber-500 dark:bg-amber-400",
                      lv === "over" && "bg-destructive",
                    )}
                    style={{ transform: `scaleX(${pct / 100})` }}
                  />
                  <span aria-hidden className="absolute inset-y-0 left-[80%] w-px bg-background/80" />
                </div>
                <button
                  type="button"
                  onClick={() => bump(it.key)}
                  disabled={it.used >= it.max}
                  aria-label={`${it.label}の使用を増やす`}
                  className="grid size-6 shrink-0 place-items-center rounded-md border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                >
                  <Plus aria-hidden className="size-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="min-h-[2.25rem]">
        {alerts.length > 0 ? (
          <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle aria-hidden className="mt-px size-3.5 shrink-0" />
            <span>
              {alerts.map((a) => a.label).join("・")}が上限の 80% を超えています。
              <button type="button" className="ml-1 font-medium underline underline-offset-2">
                プランを確認
              </button>
            </span>
          </div>
        ) : (
          <p className="px-1 py-2 text-xs text-muted-foreground">すべて上限の 80% 未満です。</p>
        )}
      </div>
    </div>
  );
}
