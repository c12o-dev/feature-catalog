"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = Array.from({ length: 7 }, (_, i) => ({
  day: `${i + 1}日`, success: 800 + Math.random() * 400, error: Math.random() * 50,
}));

export default function DevUsage() {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fill: "currentColor", fontSize: 10 }} />
          <YAxis tick={{ fill: "currentColor", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="success" fill="hsl(142 71% 45%)" stackId="a" />
          <Bar dataKey="error" fill="hsl(0 84% 60%)" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
