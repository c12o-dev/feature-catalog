"use client";

const items = [
  { label: "売上 ¥M", actual: 78, target: 80, ranges: [50, 70, 100] },
  { label: "新規ユーザー", actual: 1240, target: 1500, ranges: [800, 1200, 2000] },
  { label: "NPS", actual: 42, target: 50, ranges: [20, 40, 60] },
];

export default function BulletChart() {
  return (
    <div className="space-y-3">
      {items.map((it) => {
        const max = it.ranges[2];
        return (
          <div key={it.label} className="grid items-center gap-2" style={{ gridTemplateColumns: "8rem 1fr" }}>
            <div className="text-xs">{it.label}</div>
            <div className="relative h-5 rounded overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-zinc-300 dark:bg-zinc-800" style={{ width: `${(it.ranges[0] / max) * 100}%` }} />
              <div className="absolute inset-y-0 bg-zinc-400 dark:bg-zinc-700" style={{ left: `${(it.ranges[0] / max) * 100}%`, width: `${((it.ranges[1] - it.ranges[0]) / max) * 100}%` }} />
              <div className="absolute inset-y-0 bg-zinc-500 dark:bg-zinc-600" style={{ left: `${(it.ranges[1] / max) * 100}%`, right: 0 }} />
              <div className="absolute top-1 bottom-1 left-0 bg-foreground rounded" style={{ width: `${(it.actual / max) * 100}%` }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{ left: `${(it.target / max) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
