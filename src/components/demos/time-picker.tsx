"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Globe2, MapPin } from "lucide-react";

const subscribe = () => () => {};
const getTz = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTz = () => null;

const ZONES = [
  { tz: "Asia/Tokyo", label: "東京" },
  { tz: "Asia/Singapore", label: "シンガポール" },
  { tz: "Europe/London", label: "ロンドン" },
  { tz: "America/New_York", label: "ニューヨーク" },
  { tz: "America/Los_Angeles", label: "ロサンゼルス" },
  { tz: "UTC", label: "協定世界時" },
];
const FALLBACK_TZ = "Asia/Tokyo";

/** Offset (ms) of `tz` from UTC at instant `ms`. */
function offsetOf(tz: string, ms: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(ms));
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute")) - ms;
}

function shortOffset(tz: string, ms: number) {
  const off = Math.round(offsetOf(tz, ms) / 60000);
  const sign = off >= 0 ? "+" : "−";
  const a = Math.abs(off);
  return `UTC${sign}${Math.floor(a / 60)}${a % 60 ? `:${String(a % 60).padStart(2, "0")}` : ""}`;
}

function wallTime(tz: string, ms: number) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: tz,
    hourCycle: "h23",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(ms));
}

const clamp = (v: number, max: number) => (Number.isFinite(v) ? Math.min(max, Math.max(0, Math.trunc(v))) : 0);

export default function TimePickerDemo() {
  const id = useId();
  const detected = useSyncExternalStore(subscribe, getTz, getServerTz);
  const [override, setOverride] = useState<string | null>(null);
  const [h, setH] = useState(14);
  const [m, setM] = useState(30);

  const tz = override ?? detected ?? FALLBACK_TZ;
  const options = ZONES.some((z) => z.tz === tz) || !detected ? ZONES : [{ tz: detected, label: detected }, ...ZONES];

  // 2026-10-01 at h:m in the selected zone → UTC instant
  const guess = Date.UTC(2026, 9, 1, h, m);
  const instant = guess - offsetOf(tz, guess);

  const numCls =
    "w-16 rounded-md border bg-background px-1 py-1.5 text-center font-mono text-2xl tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <div className="mx-auto w-full max-w-sm space-y-3 rounded-lg border bg-card p-4">
      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-muted-foreground">開始時刻 · 10月1日(木)</legend>
        <div className="flex items-end justify-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <label htmlFor={`${id}-h`} className="text-[11px] text-muted-foreground">時</label>
            <input
              id={`${id}-h`}
              type="number"
              inputMode="numeric"
              min={0}
              max={23}
              value={h}
              onChange={(e) => setH(clamp(e.target.valueAsNumber, 23))}
              className={numCls}
            />
          </div>
          <span aria-hidden className="pb-2 font-mono text-2xl text-muted-foreground">:</span>
          <div className="flex flex-col items-center gap-1">
            <label htmlFor={`${id}-m`} className="text-[11px] text-muted-foreground">分</label>
            <input
              id={`${id}-m`}
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              step={5}
              value={m}
              onChange={(e) => setM(clamp(e.target.valueAsNumber, 59))}
              className={numCls}
            />
          </div>
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor={`${id}-tz`} className="flex items-center gap-1.5 text-xs font-medium">
          <Globe2 className="size-3.5 text-muted-foreground" />
          タイムゾーン
        </label>
        <select
          id={`${id}-tz`}
          value={tz}
          onChange={(e) => setOverride(e.target.value)}
          className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {options.map((z) => (
            <option key={z.tz} value={z.tz}>
              {z.label}（{shortOffset(z.tz, instant)}）
            </option>
          ))}
        </select>
        <p className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
          <MapPin className="size-3" />
          {detected === null ? (
            "タイムゾーンを検出中…"
          ) : override && override !== detected ? (
            <>
              手動で設定中 ·{" "}
              <button type="button" className="underline underline-offset-2 hover:text-foreground" onClick={() => setOverride(null)}>
                自動検出（{detected}）に戻す
              </button>
            </>
          ) : (
            <>自動検出: {detected}</>
          )}
        </p>
      </div>

      <div className="rounded-md bg-muted/50 p-2.5">
        <p className="mb-1.5 text-[11px] text-muted-foreground">他の地域では</p>
        <ul className="space-y-1 text-xs">
          {ZONES.filter((z) => z.tz !== tz)
            .slice(0, 3)
            .map((z) => {
              const parts = wallTime(z.tz, instant);
              const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
              return (
                <li key={z.tz} className="flex items-center justify-between gap-2">
                  <span className="truncate">{z.label}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {get("month")}/{get("day")}({get("weekday")}){" "}
                    <span className="font-medium text-foreground">
                      {get("hour")}:{get("minute")}
                    </span>
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
