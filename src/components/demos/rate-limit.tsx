"use client";

export default function RateLimit() {
  const used = 7800;
  const limit = 10000;
  const pct = (used / limit) * 100;
  return (
    <div className="space-y-2 max-w-sm">
      <div className="flex items-baseline justify-between text-xs">
        <span>API 残量</span>
        <span className="tabular-nums text-muted-foreground">{used.toLocaleString()} / {limit.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${pct > 80 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[10px] text-muted-foreground">リセットまで 23 分 (X-RateLimit-Reset)</div>
    </div>
  );
}
