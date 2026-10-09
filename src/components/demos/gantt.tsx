"use client";

const tasks = [
  { name: "リサーチ", start: 0, len: 3, color: "bg-blue-500" },
  { name: "設計", start: 2, len: 4, color: "bg-purple-500" },
  { name: "実装", start: 5, len: 6, color: "bg-emerald-500" },
  { name: "QA", start: 9, len: 3, color: "bg-amber-500" },
  { name: "リリース", start: 11, len: 1, color: "bg-rose-500" },
];

const days = 14;

export default function Gantt() {
  return (
    <div className="space-y-1.5">
      <div className="grid text-[10px] text-muted-foreground" style={{ gridTemplateColumns: `5rem repeat(${days}, 1fr)` }}>
        <div />
        {Array.from({ length: days }, (_, i) => (
          <div key={i} className="text-center">{i + 1}</div>
        ))}
      </div>
      {tasks.map((t) => (
        <div key={t.name} className="grid items-center gap-1" style={{ gridTemplateColumns: `5rem repeat(${days}, 1fr)` }}>
          <div className="text-xs">{t.name}</div>
          {Array.from({ length: days }, (_, i) => {
            const inRange = i >= t.start && i < t.start + t.len;
            return <div key={i} className={`h-4 rounded ${inRange ? t.color : "bg-muted/40"}`} />;
          })}
        </div>
      ))}
    </div>
  );
}
