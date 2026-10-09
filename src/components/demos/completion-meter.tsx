"use client";

const tasks = [
  { label: "プロフィール写真", done: true }, { label: "自己紹介", done: true },
  { label: "スキル登録", done: true }, { label: "ポートフォリオ", done: false }, { label: "経歴", done: false },
];

export default function CompletionMeter() {
  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);
  const r = 36;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} className="fill-none stroke-blue-500 transition-[stroke-dashoffset] duration-700" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} />
      </svg>
      <div>
        <div className="text-sm font-medium">プロフィール完成度</div>
        <div className="text-2xl font-semibold tabular-nums">{pct}%</div>
        <div className="text-xs text-muted-foreground">残り {tasks.length - done} 項目</div>
      </div>
    </div>
  );
}
