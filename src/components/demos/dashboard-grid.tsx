"use client";

const widgets = [
  { title: "売上", v: "¥1.2M", trend: "+12%", span: "col-span-2" },
  { title: "新規ユーザー", v: "1,284" },
  { title: "MRR", v: "¥320K", trend: "+5%" },
  { title: "解約率", v: "1.8%", trend: "-0.3%" },
  { title: "アクティブ", v: "8,420" },
];

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {widgets.map((w, i) => (
        <div key={i} className={`rounded-md border bg-background p-3 cursor-grab ${w.span ?? ""}`}>
          <div className="text-xs text-muted-foreground">{w.title}</div>
          <div className="text-xl font-semibold tabular-nums">{w.v}</div>
          {w.trend && <div className="text-[10px] text-emerald-600">{w.trend}</div>}
        </div>
      ))}
      <div className="text-xs text-muted-foreground col-span-3 text-center pt-1">⇄ ドラッグで並べ替え (UI のみ)</div>
    </div>
  );
}
