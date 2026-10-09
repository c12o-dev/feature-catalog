"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

const data = Array.from({ length: 24 }, (_, i) => ({
  i,
  v: 50 + 30 * Math.sin(i / 3) + (i * 1.5),
}));

export default function Sparkline() {
  const last = data[data.length - 1].v;
  const prev = data[0].v;
  const delta = ((last - prev) / prev) * 100;

  return (
    <div className="flex items-center gap-6">
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">MRR</div>
        <div className="text-2xl font-semibold tabular-nums">¥{Math.round(last * 100).toLocaleString()}</div>
        <div className="text-xs text-emerald-600">+{delta.toFixed(1)}%</div>
      </div>
      <div className="flex-1 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="v" stroke="hsl(142 71% 45%)" strokeWidth={1.5} fill="url(#spark)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
