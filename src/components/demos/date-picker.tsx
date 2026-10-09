"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "single" | "range";
const TODAY = { y: 2026, m: 9, d: 1 }; // 2026-10-01 (固定の基準日)
const WD = ["日", "月", "火", "水", "木", "金", "土"];

const key = (y: number, m: number, d: number) => y * 10000 + (m + 1) * 100 + d;
const fmt = (k: number) => `${Math.floor(k / 10000)}/${Math.floor(k / 100) % 100}/${k % 100}`;

export default function DatePickerDemo() {
  const [mode, setMode] = useState<Mode>("range");
  const [y, setY] = useState(TODAY.y);
  const [m, setM] = useState(TODAY.m);
  const [single, setSingle] = useState<number | null>(null);
  const [start, setStart] = useState<number | null>(key(2026, 9, 8));
  const [end, setEnd] = useState<number | null>(key(2026, 9, 12));
  const [hover, setHover] = useState<number | null>(null);

  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array<null>(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const todayKey = key(TODAY.y, TODAY.m, TODAY.d);

  const shift = (delta: number) => {
    const t = y * 12 + m + delta;
    setY(Math.floor(t / 12));
    setM(t % 12);
  };

  const pick = (k: number) => {
    if (mode === "single") return setSingle(k);
    if (start === null || end !== null) {
      setStart(k);
      setEnd(null);
    } else if (k < start) {
      setEnd(start);
      setStart(k);
    } else {
      setEnd(k);
    }
  };

  const previewEnd = mode === "range" && start !== null && end === null ? hover : end;
  const lo = start !== null && previewEnd !== null ? Math.min(start, previewEnd) : start;
  const hi = start !== null && previewEnd !== null ? Math.max(start, previewEnd) : start;

  const nights = start !== null && end !== null ? Math.round((new Date(Math.floor(end / 10000), (Math.floor(end / 100) % 100) - 1, end % 100).getTime() - new Date(Math.floor(start / 10000), (Math.floor(start / 100) % 100) - 1, start % 100).getTime()) / 86400000) : 0;

  const summary =
    mode === "single"
      ? single
        ? `選択: ${fmt(single)}`
        : "日付を選んでください"
      : start && end
        ? `${fmt(start)} → ${fmt(end)}（${nights} 泊）`
        : start
          ? `${fmt(start)} → 終了日を選択`
          : "開始日を選んでください";

  return (
    <div className="mx-auto w-full max-w-xs rounded-lg border bg-card p-3 shadow-sm">
      <div role="radiogroup" aria-label="選択モード" className="mb-3 grid grid-cols-2 gap-1 rounded-md bg-muted p-1 text-xs">
        {(["single", "range"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={mode === v}
            onClick={() => setMode(v)}
            className={cn("rounded px-2 py-1 font-medium transition-colors", mode === v ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            {v === "single" ? "単一日" : "期間"}
          </button>
        ))}
      </div>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} aria-label="前の月" className="grid size-7 place-items-center rounded-md hover:bg-accent">
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-sm font-medium tabular-nums" aria-live="polite">
          {y} 年 {m + 1} 月
        </div>
        <button type="button" onClick={() => shift(1)} aria-label="次の月" className="grid size-7 place-items-center rounded-md hover:bg-accent">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center" onMouseLeave={() => setHover(null)}>
        {WD.map((d, i) => (
          <div key={d} className={cn("pb-1 text-[10px]", i === 0 ? "text-rose-500" : "text-muted-foreground")}>
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const k = key(y, m, d);
          const isSel = mode === "single" ? single === k : k === lo || k === hi;
          const inRange = mode === "range" && lo !== null && hi !== null && k > lo && k < hi;
          return (
            <div key={k} className={cn("py-0.5", inRange && "bg-primary/10", mode === "range" && k === lo && hi !== lo && "rounded-l-md bg-primary/10", mode === "range" && k === hi && hi !== lo && "rounded-r-md bg-primary/10")}>
              <button
                type="button"
                onClick={() => pick(k)}
                onMouseEnter={() => setHover(k)}
                onFocus={() => setHover(k)}
                aria-label={`${m + 1}月${d}日`}
                aria-pressed={isSel}
                aria-current={k === todayKey ? "date" : undefined}
                className={cn(
                  "mx-auto grid size-8 place-items-center rounded-md text-xs tabular-nums transition-colors",
                  isSel ? "bg-primary font-medium text-primary-foreground" : "hover:bg-accent",
                  k === todayKey && !isSel && "ring-1 ring-inset ring-border font-medium",
                )}
              >
                {d}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-2 border-t pt-2 text-center text-xs text-muted-foreground tabular-nums" aria-live="polite">
        {summary}
      </p>
    </div>
  );
}
