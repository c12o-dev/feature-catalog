"use client";

const events = [
  { day: 5, title: "1on1", color: "bg-blue-200 text-blue-900" },
  { day: 5, title: "Review", color: "bg-emerald-200 text-emerald-900" },
  { day: 12, title: "Sprint planning", color: "bg-purple-200 text-purple-900" },
  { day: 18, title: "Demo", color: "bg-amber-200 text-amber-900" },
  { day: 25, title: "All hands", color: "bg-rose-200 text-rose-900" },
];

export default function CalendarView() {
  const wd = ["日", "月", "火", "水", "木", "金", "土"];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-7 text-xs text-muted-foreground text-center">
        {wd.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border rounded overflow-hidden">
        {days.map((d) => {
          const evs = events.filter((e) => e.day === d);
          return (
            <div key={d} className="bg-background min-h-[3.5rem] p-1 text-xs">
              <div className="text-muted-foreground tabular-nums mb-0.5">{d}</div>
              {evs.map((e, i) => <div key={i} className={`rounded px-1 mb-0.5 truncate ${e.color}`}>{e.title}</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
