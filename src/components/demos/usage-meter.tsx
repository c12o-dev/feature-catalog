"use client";

const items = [
  { label: "API リクエスト", used: 7800, max: 10000 },
  { label: "ストレージ", used: 4.2, max: 10, unit: "GB" },
  { label: "メンバー", used: 8, max: 25 },
];

export default function UsageMeter() {
  return (
    <div className="space-y-3 max-w-md">
      {items.map((it) => {
        const pct = (it.used / it.max) * 100;
        const warn = pct > 75;
        return (
          <div key={it.label}>
            <div className="flex items-baseline justify-between text-xs mb-1">
              <span>{it.label}</span>
              <span className="tabular-nums text-muted-foreground">{it.used.toLocaleString()}{it.unit ?? ""} / {it.max.toLocaleString()}{it.unit ?? ""}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full transition-all ${warn ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
