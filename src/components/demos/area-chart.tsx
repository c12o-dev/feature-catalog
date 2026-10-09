"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = Array.from({ length: 30 }, (_, i) => ({ d: i + 1, v: 50 + 30 * Math.sin(i / 4) + i * 1.5 }));

export default function AreaChartDemo() {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeOpacity={0.1} />
          <XAxis dataKey="d" tick={{ fill: "currentColor", fontSize: 10 }} />
          <YAxis tick={{ fill: "currentColor", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Area dataKey="v" stroke="hsl(217 91% 60%)" fill="url(#ac)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
