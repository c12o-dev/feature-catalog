"use client";

const stages = [
  { label: "訪問", v: 10000, color: "bg-blue-500" },
  { label: "サインアップ", v: 3200, color: "bg-blue-400" },
  { label: "プロフィール作成", v: 1800, color: "bg-blue-300" },
  { label: "課金", v: 420, color: "bg-blue-200" },
];

export default function Funnel() {
  const max = stages[0].v;
  return (
    <div className="space-y-1.5">
      {stages.map((s, i) => {
        const pct = (s.v / max) * 100;
        const conv = i === 0 ? 100 : (s.v / stages[i - 1].v) * 100;
        return (
          <div key={s.label} className="flex items-center gap-3 text-xs">
            <div className="w-28 text-right">{s.label}</div>
            <div className="flex-1 h-6 bg-muted rounded relative overflow-hidden">
              <div className={`h-full ${s.color} text-white grid place-items-center font-medium tabular-nums`} style={{ width: `${pct}%` }}>
                {s.v.toLocaleString()}
              </div>
            </div>
            <div className="w-12 text-right text-muted-foreground tabular-nums">{conv.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  );
}
