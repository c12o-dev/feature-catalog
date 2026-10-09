"use client";

import { useId, useState } from "react";
import { Contrast } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function HighContrast() {
  const [hc, setHc] = useState(false);
  const id = useId();

  return (
    <div className="mx-auto w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} id={`${id}-label`} className="flex items-center gap-1.5 text-sm font-medium">
          <Contrast className="size-4" aria-hidden />
          高コントラスト
        </label>
        <Switch id={id} aria-labelledby={`${id}-label`} checked={hc} onCheckedChange={setHc} />
      </div>

      <div
        className={cn(
          "space-y-3 rounded-lg p-4 transition-colors",
          hc ? "border-2 border-white bg-black text-white" : "border bg-card text-foreground",
        )}
      >
        <div>
          <h3 className={cn("font-semibold", hc && "underline decoration-2 underline-offset-4")}>お届け予定日の変更</h3>
          <p className={cn("mt-1 text-sm", hc ? "text-white" : "text-muted-foreground")}>
            10月4日（日）の午前中にお届けします。変更は前日 18 時まで受け付けます。
          </p>
        </div>
        <label className="block space-y-1">
          <span className={cn("text-xs", hc ? "font-semibold text-white" : "text-muted-foreground")}>希望時間帯</span>
          <select
            className={cn(
              "h-8 w-full rounded-md px-2 text-sm outline-none",
              hc
                ? "border-2 border-white bg-black text-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                : "border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <option>午前中</option>
            <option>14〜16 時</option>
            <option>18〜20 時</option>
          </select>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <a
            href="#delivery-help"
            onClick={(e) => e.preventDefault()}
            className={cn(
              "text-sm outline-none",
              hc
                ? "font-semibold text-yellow-300 underline decoration-2 underline-offset-2 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                : "text-sky-700 hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 dark:text-sky-400",
            )}
          >
            配達について詳しく
          </a>
          <button
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium outline-none",
              hc
                ? "border-2 border-yellow-300 bg-yellow-300 text-black focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
                : "bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            変更を保存
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border bg-card p-2">
          <dt className="text-muted-foreground">本文のコントラスト比</dt>
          <dd className="font-medium tabular-nums">{hc ? "21 : 1" : "約 4.6 : 1"}</dd>
        </div>
        <div className="rounded-md border bg-card p-2">
          <dt className="text-muted-foreground">リンクの識別</dt>
          <dd className="font-medium">{hc ? "色 + 下線 + 太字" : "色のみ"}</dd>
        </div>
      </dl>
    </div>
  );
}
