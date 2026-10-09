"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const MIN = 1;
const MAX = 10;
const PRICE = 1480;

export default function Stepper() {
  const [n, setN] = useState(2);
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, Math.round(v)));
  const commit = () => {
    if (draft === null) return;
    const v = Number(draft);
    setN(Number.isFinite(v) && draft.trim() !== "" ? clamp(v) : n);
    setDraft(null);
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="size-14 shrink-0 rounded-md bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-900/60 dark:to-amber-700/60" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">ドリップバッグ 10 個入り</div>
          <div className="text-xs text-muted-foreground tabular-nums">¥{PRICE.toLocaleString("ja-JP")} / 箱</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <label htmlFor="stepper-qty" className="text-xs text-muted-foreground">
            数量
          </label>
          <div className="flex items-center rounded-md border">
            <button
              type="button"
              aria-label="数量を 1 減らす"
              onClick={() => setN((v) => clamp(v - 1))}
              disabled={n <= MIN}
              className="grid size-9 place-items-center rounded-l-md hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Minus className="size-4" />
            </button>
            <input
              id="stepper-qty"
              type="text"
              inputMode="numeric"
              role="spinbutton"
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={n}
              value={draft ?? String(n)}
              onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === "Enter") commit();
                else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setN((v) => clamp(v + 1));
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setN((v) => clamp(v - 1));
                }
              }}
              className="h-9 w-12 border-x bg-transparent text-center text-sm tabular-nums outline-none focus-visible:bg-muted/50"
            />
            <button
              type="button"
              aria-label="数量を 1 増やす"
              onClick={() => setN((v) => clamp(v + 1))}
              disabled={n >= MAX}
              className="grid size-9 place-items-center rounded-r-md hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">小計</div>
          <div className="text-base font-semibold tabular-nums" aria-live="polite">
            ¥{(PRICE * n).toLocaleString("ja-JP")}
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
        {n >= MAX ? `1 回のご注文は ${MAX} 個までです` : `${MIN}〜${MAX} 個まで選べます`}
      </p>
    </div>
  );
}
