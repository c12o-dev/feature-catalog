"use client";

import { useState, useSyncExternalStore } from "react";
import { Wrench, X } from "lucide-react";

const START = new Date("2026-10-08T02:00:00+09:00");
const END = new Date("2026-10-08T04:00:00+09:00");
const JST = "Asia/Tokyo";

const noop = () => () => {};
function useViewerTz() {
  return useSyncExternalStore(
    noop,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => JST,
  );
}

function fmt(d: Date, timeZone: string, withDate: boolean) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    ...(withDate ? { month: "numeric", day: "numeric", weekday: "short" } : {}),
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function tzLabel(timeZone: string) {
  const part = new Intl.DateTimeFormat("ja-JP", { timeZone, timeZoneName: "short" })
    .formatToParts(START)
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? timeZone;
}

export default function MaintenanceBanner() {
  const tz = useViewerTz();
  const [open, setOpen] = useState(true);
  const isJst = tz === JST;

  return (
    <div className="space-y-3">
      {open ? (
        <div
          role="region"
          aria-label="メンテナンスのお知らせ"
          className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100"
        >
          <Wrench className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium">今夜メンテナンスを実施します</p>
            <p className="mt-0.5 text-xs opacity-80">
              <time dateTime={START.toISOString()}>{fmt(START, tz, true)}</time>–
              <time dateTime={END.toISOString()}>{fmt(END, tz, false)}</time>（{isJst ? "日本時間" : tzLabel(tz)}）の間、サービスを停止します。
            </p>
            {!isJst && (
              <p className="mt-0.5 text-xs opacity-80">
                日本時間 {fmt(START, JST, true)}–{fmt(END, JST, false)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="お知らせを閉じる"
            className="-m-1 rounded p-1 hover:bg-amber-200/60 dark:hover:bg-amber-900/60"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
          <span>お知らせを閉じました</span>
          <button type="button" onClick={() => setOpen(true)} className="rounded-md border bg-background px-2 py-1 hover:bg-muted">
            再表示
          </button>
        </div>
      )}
      <div className="space-y-2 rounded-lg border bg-card p-4" aria-hidden>
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
