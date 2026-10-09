"use client";

const stages = [
  { label: "訪問", v: 10000 },
  { label: "サインアップ", v: 3200 },
  { label: "プロフィール作成", v: 1800 },
  { label: "課金", v: 420 },
];

const shade = ["bg-blue-600 dark:bg-blue-500", "bg-blue-500 dark:bg-blue-400", "bg-blue-400 dark:bg-blue-300", "bg-blue-300 dark:bg-blue-200"];

export default function Funnel() {
  const max = stages[0].v;
  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {stages.map((s, i) => {
        const pct = (s.v / max) * 100;
        const conv = i === 0 ? null : (s.v / stages[i - 1].v) * 100;
        return (
          <div key={s.label} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-medium">{s.label}</span>
              <span className="flex items-baseline gap-2 tabular-nums">
                <span className="text-sm font-semibold">{s.v.toLocaleString("ja-JP")}</span>
                <span className="w-24 text-right text-muted-foreground">
                  {conv === null ? "全体の 100%" : `前段比 ${conv.toFixed(0)}%`}
                </span>
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted">
              <div className={`h-full rounded-full ${shade[i]}`} style={{ width: `${Math.max(pct, 1.5)}%` }} />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground tabular-nums">
        全体コンバージョン率 {((stages[stages.length - 1].v / max) * 100).toFixed(1)}%
      </p>
    </div>
  );
}
