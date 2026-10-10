"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = [
  { round: "R1", Alice: 1, Bob: 3, Carol: 2, Dan: 4 },
  { round: "R2", Alice: 2, Bob: 1, Carol: 3, Dan: 4 },
  { round: "R3", Alice: 1, Bob: 2, Carol: 4, Dan: 3 },
  { round: "R4", Alice: 1, Bob: 3, Carol: 2, Dan: 4 },
  { round: "R5", Alice: 2, Bob: 1, Carol: 3, Dan: 4 },
];

export default function BumpChart() {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="round" tick={{ fill: "currentColor", fontSize: 10 }} />
          <YAxis reversed domain={[1, 4]} ticks={[1, 2, 3, 4]} tick={{ fill: "currentColor", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {["Alice", "Bob", "Carol", "Dan"].map((n, i) => (
            <Line key={n} dataKey={n} type="monotone" stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i]} strokeWidth={2} dot={{ r: 4 }} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
