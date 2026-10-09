"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// seed 固定の PRNG（mulberry32）
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261001);
// 基準日 2026-10-01 の前 7 日間
const days = ["9/25", "9/26", "9/27", "9/28", "9/29", "9/30", "10/1"];
const data = days.map((day, i) => ({
  day,
  success: Math.round(820 + rand() * 380 + (i === 6 ? 180 : 0)),
  error: Math.round(8 + rand() * 30 + (i === 3 ? 60 : 0)),
}));
const total = data.reduce((a, d) => a + d.success + d.error, 0);
const errors = data.reduce((a, d) => a + d.error, 0);
const H = 180;

export default function DevUsage() {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">API リクエスト（過去 7 日）</div>
          <div className="text-xl font-semibold tabular-nums">{total.toLocaleString("ja-JP")}</div>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-emerald-500" />成功</div>
          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-rose-500" />エラー <span className="tabular-nums text-muted-foreground">{((errors / total) * 100).toFixed(1)}%</span></div>
        </div>
      </div>
      <div style={{ height: H }} className="text-muted-foreground" role="img" aria-label={`過去 7 日の API リクエスト。合計 ${total} 件、うちエラー ${errors} 件。9/28 にエラーが増加。`}>
        <ResponsiveContainer width="100%" height={H} initialDimension={{ width: 320, height: H }}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fill: "currentColor", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "currentColor", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [Number(v).toLocaleString("ja-JP"), name === "success" ? "成功" : "エラー"]}
            />
            <Bar dataKey="success" stackId="a" fill="#10b981" />
            <Bar dataKey="error" stackId="a" fill="#f43f5e" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
