"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL_ITEMS = 238;
const PER_PAGE = 20;
const TOTAL = Math.ceil(TOTAL_ITEMS / PER_PAGE);

function pageWindow(p: number, total: number): (number | "gap-start" | "gap-end")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "gap-start" | "gap-end")[] = [1];
  const start = Math.max(2, Math.min(p - 1, total - 4));
  const end = Math.min(total - 1, Math.max(p + 1, 5));
  if (start > 2) out.push("gap-start");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("gap-end");
  out.push(total);
  return out;
}

export default function Pagination() {
  const [p, setP] = useState(1);
  const from = (p - 1) * PER_PAGE + 1;
  const to = Math.min(TOTAL_ITEMS, p * PER_PAGE);
  const navBtn =
    "grid size-7 place-items-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 @[360px]:size-8";

  return (
    <div className="@container mx-auto w-full max-w-md space-y-3">
      <p className="text-center text-xs text-muted-foreground tabular-nums" aria-live="polite">
        全 {TOTAL_ITEMS} 件中 {from}–{to} 件
      </p>
      <nav aria-label="ページ送り" className="flex items-center justify-center gap-0.5 @[360px]:gap-1">
        <button
          type="button"
          aria-label="前のページ"
          onClick={() => setP((x) => Math.max(1, x - 1))}
          disabled={p === 1}
          className={navBtn}
        >
          <ChevronLeft className="size-4" />
        </button>
        {pageWindow(p, TOTAL).map((x) =>
          typeof x === "string" ? (
            <span key={x} aria-hidden className="grid h-7 min-w-6 place-items-center text-xs text-muted-foreground @[360px]:h-8 @[360px]:min-w-8">
              …
            </span>
          ) : (
            <button
              key={x}
              type="button"
              onClick={() => setP(x)}
              aria-label={`${x} ページ`}
              aria-current={p === x ? "page" : undefined}
              className={cn(
                "h-7 min-w-6 rounded-md px-1 text-xs font-medium tabular-nums transition-colors @[360px]:h-8 @[360px]:min-w-8 @[360px]:text-sm",
                p === x ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
              )}
            >
              {x}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="次のページ"
          onClick={() => setP((x) => Math.min(TOTAL, x + 1))}
          disabled={p === TOTAL}
          className={navBtn}
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}
