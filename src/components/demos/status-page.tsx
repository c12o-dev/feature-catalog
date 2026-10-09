"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

type Day = "ok" | "minor" | "major";
type Status = "operational" | "degraded" | "outage";

const services: { name: string; uptime: number; status: Status; days: Day[] }[] = [
  { name: "API", uptime: 99.99, status: "operational", days: mk([]) },
  { name: "Web アプリ", uptime: 99.97, status: "operational", days: mk([[12, "minor"]]) },
  { name: "データベース", uptime: 99.95, status: "operational", days: mk([[4, "minor"]]) },
  { name: "バックグラウンドジョブ", uptime: 99.42, status: "degraded", days: mk([[17, "major"], [29, "minor"]]) },
];

function mk(marks: [number, Day][]): Day[] {
  const d: Day[] = Array.from({ length: 30 }, () => "ok");
  for (const [i, v] of marks) d[i] = v;
  return d;
}

const label: Record<Status, string> = { operational: "正常", degraded: "パフォーマンス低下", outage: "障害" };
const dot: Record<Status, string> = { operational: "bg-emerald-500", degraded: "bg-amber-500", outage: "bg-rose-500" };
const bar: Record<Day, string> = {
  ok: "bg-emerald-500/80 dark:bg-emerald-400/70",
  minor: "bg-amber-500 dark:bg-amber-400",
  major: "bg-rose-500 dark:bg-rose-400",
};

export default function StatusPage() {
  const worst: Status = services.some((s) => s.status === "outage")
    ? "outage"
    : services.some((s) => s.status === "degraded")
      ? "degraded"
      : "operational";
  const affected = services.filter((s) => s.status !== "operational");

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-lg border bg-background">
      <div
        role="status"
        className={`flex items-start gap-2 px-4 py-3 text-sm ${
          worst === "operational"
            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
            : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        }`}
      >
        {worst === "operational" ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="font-medium">
            {worst === "operational" ? "すべてのシステムは正常です" : "一部のシステムで問題が発生しています"}
          </p>
          {affected.length > 0 && (
            <p className="text-xs opacity-80">
              {affected.map((s) => s.name).join("、")}で処理の遅延を調査中（10/01 08:42 更新）
            </p>
          )}
        </div>
      </div>
      <ul className="divide-y">
        {services.map((s) => (
          <li key={s.name} className="space-y-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={`size-2 shrink-0 rounded-full ${dot[s.status]}`} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm">{s.name}</span>
              <span className={`text-xs ${s.status === "operational" ? "text-muted-foreground" : "text-amber-700 dark:text-amber-300"}`}>
                {label[s.status]}
              </span>
            </div>
            <div className="flex h-6 gap-px" role="img" aria-label={`${s.name} の過去 30 日の稼働率 ${s.uptime}%`}>
              {s.days.map((d, i) => (
                <div key={i} className={`min-w-0 flex-1 rounded-[2px] ${bar[d]}`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 日前</span>
              <span className="tabular-nums">稼働率 {s.uptime}%</span>
              <span>今日</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
