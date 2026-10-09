"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "month" | "week" | "day";
type Ev = { date: string; start: number; end: number; title: string; tone: number };

const TONES = [
  "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100",
  "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100",
  "bg-violet-100 text-violet-900 dark:bg-violet-500/20 dark:text-violet-100",
  "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100",
];

const EVENTS: Ev[] = [
  { date: "2026-10-01", start: 10, end: 11, title: "1on1 中村", tone: 0 },
  { date: "2026-10-01", start: 14, end: 15.5, title: "デザインレビュー", tone: 2 },
  { date: "2026-10-02", start: 11, end: 12, title: "採用面接", tone: 3 },
  { date: "2026-10-05", start: 9.5, end: 10, title: "朝会", tone: 1 },
  { date: "2026-10-05", start: 13, end: 15, title: "スプリント計画", tone: 2 },
  { date: "2026-10-07", start: 16, end: 17, title: "顧客デモ", tone: 3 },
  { date: "2026-10-12", start: 10, end: 11, title: "1on1 小林", tone: 0 },
  { date: "2026-10-15", start: 15, end: 16, title: "リリース判定", tone: 1 },
  { date: "2026-10-20", start: 13, end: 14, title: "全社定例", tone: 2 },
  { date: "2026-10-23", start: 18, end: 20, title: "チーム懇親会", tone: 3 },
  { date: "2026-10-28", start: 11, end: 12, title: "四半期振り返り", tone: 0 },
];

const TODAY = Date.UTC(2026, 9, 1);
const DAY = 86400000;
const WD = ["日", "月", "火", "水", "木", "金", "土"];
const VIEWS: { key: View; label: string }[] = [
  { key: "month", label: "月" },
  { key: "week", label: "週" },
  { key: "day", label: "日" },
];

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const md = (t: number) => {
  const d = new Date(t);
  return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日`;
};
const eventsOn = (t: number) => EVENTS.filter((e) => e.date === iso(t)).sort((a, b) => a.start - b.start);
const hm = (h: number) => `${Math.floor(h)}:${h % 1 ? "30" : "00"}`;

export default function CalendarView() {
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(TODAY);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const d = new Date(cursor);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();

  const move = (dir: 1 | -1) => {
    if (view === "month") setCursor(Date.UTC(y, m + dir, 1));
    else setCursor(cursor + dir * (view === "week" ? 7 : 1) * DAY);
  };

  const title =
    view === "month"
      ? `${y}年${m + 1}月`
      : view === "week"
        ? `${md(cursor - d.getUTCDay() * DAY)} 〜 ${md(cursor + (6 - d.getUTCDay()) * DAY)}`
        : `${md(cursor)}（${WD[d.getUTCDay()]}）`;

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    const j = (i + n + VIEWS.length) % VIEWS.length;
    setView(VIEWS[j].key);
    tabRefs.current[j]?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => move(-1)} aria-label="前へ" className="rounded-md p-1.5 hover:bg-muted">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="次へ" className="rounded-md p-1.5 hover:bg-muted">
            <ChevronRight className="size-4" />
          </button>
          <h3 className="ml-1 text-sm font-medium tabular-nums" aria-live="polite">{title}</h3>
          <button
            type="button"
            onClick={() => setCursor(TODAY)}
            className="ml-1 rounded-md border px-2 py-0.5 text-xs hover:bg-muted"
          >
            今日
          </button>
        </div>
        <div role="tablist" aria-label="表示切替" className="inline-flex rounded-md border bg-muted p-0.5">
          {VIEWS.map((v, i) => (
            <button
              key={v.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`cal-tab-${v.key}`}
              aria-selected={view === v.key}
              aria-controls="cal-panel"
              tabIndex={view === v.key ? 0 : -1}
              onClick={() => setView(v.key)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={cn(
                "rounded px-3 py-1 text-xs text-muted-foreground",
                view === v.key && "bg-background text-foreground shadow-sm",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id="cal-panel" aria-labelledby={`cal-tab-${view}`}>
        {view === "month" && <Month y={y} m={m} onPick={(t) => { setCursor(t); setView("day"); }} />}
        {view === "week" && <Week cursor={cursor} onPick={(t) => { setCursor(t); setView("day"); }} />}
        {view === "day" && <DayView t={cursor} />}
      </div>
    </div>
  );
}

function Month({ y, m, onPick }: { y: number; m: number; onPick: (t: number) => void }) {
  const first = Date.UTC(y, m, 1);
  const lead = new Date(first).getUTCDay();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = Math.ceil((lead + days) / 7) * 7;
  return (
    <div>
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        {WD.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md border bg-border">
        {Array.from({ length: cells }, (_, i) => {
          const t = first + (i - lead) * DAY;
          const inMonth = i >= lead && i < lead + days;
          const evs = eventsOn(t);
          const today = t === TODAY;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(t)}
              aria-label={`${md(t)} 予定 ${evs.length} 件`}
              className={cn("min-h-14 min-w-0 bg-card p-1 text-left align-top text-xs hover:bg-muted/60", !inMonth && "bg-muted/40 text-muted-foreground/60")}
            >
              <span
                className={cn(
                  "mb-0.5 inline-grid size-5 place-items-center rounded-full tabular-nums",
                  today ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {new Date(t).getUTCDate()}
              </span>
              {evs.slice(0, 2).map((e) => (
                <span key={e.title} className={cn("mb-0.5 hidden truncate rounded px-1 sm:block", TONES[e.tone])}>
                  {e.title}
                </span>
              ))}
              {evs.length > 0 && (
                <span className="flex gap-0.5 sm:hidden" aria-hidden>
                  {evs.map((e) => (
                    <span key={e.title} className={cn("size-1.5 rounded-full", TONES[e.tone])} />
                  ))}
                </span>
              )}
              {evs.length > 2 && <span className="hidden text-[10px] text-muted-foreground sm:block">他 {evs.length - 2} 件</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Week({ cursor, onPick }: { cursor: number; onPick: (t: number) => void }) {
  const start = cursor - new Date(cursor).getUTCDay() * DAY;
  return (
    <div className="overflow-x-auto rounded-md border">
      <div className="grid min-w-[560px] grid-cols-7 divide-x">
        {Array.from({ length: 7 }, (_, i) => {
          const t = start + i * DAY;
          const evs = eventsOn(t);
          return (
            <div key={i} className="min-h-40 bg-card">
              <button
                type="button"
                onClick={() => onPick(t)}
                className={cn("w-full border-b px-2 py-1.5 text-left text-xs hover:bg-muted/60", t === TODAY && "text-primary")}
              >
                <span className="text-muted-foreground">{WD[i]}</span>{" "}
                <span className="font-medium tabular-nums">{new Date(t).getUTCDate()}</span>
              </button>
              <div className="space-y-1 p-1">
                {evs.map((e) => (
                  <div key={e.title} className={cn("rounded px-1.5 py-1 text-xs", TONES[e.tone])}>
                    <div className="tabular-nums opacity-80">{hm(e.start)}</div>
                    <div className="truncate">{e.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({ t }: { t: number }) {
  const evs = eventsOn(t);
  const from = 9;
  const to = 20;
  const ROW = 28;
  return (
    <div className="relative max-h-72 overflow-y-auto rounded-md border bg-card">
      <div className="relative" style={{ height: (to - from) * ROW }}>
        {Array.from({ length: to - from }, (_, i) => (
          <div key={i} className="absolute inset-x-0 flex border-t first:border-t-0" style={{ top: i * ROW }}>
            <span className="w-12 shrink-0 px-2 pt-0.5 text-right text-[10px] tabular-nums text-muted-foreground">{from + i}:00</span>
          </div>
        ))}
        {evs.map((e) => (
          <div
            key={e.title}
            className={cn("absolute left-14 right-2 overflow-hidden rounded-md px-2 py-1 text-xs", TONES[e.tone])}
            style={{ top: (e.start - from) * ROW + 1, height: (e.end - e.start) * ROW - 2 }}
          >
            <span className="font-medium">{e.title}</span>{" "}
            <span className="tabular-nums opacity-80">{hm(e.start)}–{hm(e.end)}</span>
          </div>
        ))}
        {evs.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">予定はありません</div>
        )}
      </div>
    </div>
  );
}
