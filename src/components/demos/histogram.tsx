"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const bins = [
  { range: "0-10", count: 4 }, { range: "10-20", count: 12 }, { range: "20-30", count: 28 },
  { range: "30-40", count: 45 }, { range: "40-50", count: 62 }, { range: "50-60", count: 48 },
  { range: "60-70", count: 26 }, { range: "70-80", count: 14 }, { range: "80-90", count: 6 }, { range: "90-100", count: 2 },
];

export default function Histogram() {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bins}>
          <XAxis dataKey="range" tick={{ fill: "currentColor", fontSize: 10 }} />
          <YAxis tick={{ fill: "currentColor", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="count" fill="hsl(217 91% 60%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
