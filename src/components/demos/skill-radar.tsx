"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const data = [
  { skill: "Frontend", value: 85 },
  { skill: "Backend", value: 92 },
  { skill: "DB", value: 70 },
  { skill: "DevOps", value: 65 },
  { skill: "UI/UX", value: 60 },
  { skill: "Security", value: 75 },
];

export default function SkillRadar() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid className="opacity-30" />
          <PolarAngleAxis dataKey="skill" className="text-xs" tick={{ fill: "currentColor" }} />
          {/* keeps the concentric gridlines; the 0/25/50/75/100 tick values are hidden because they
              ran along the "Backend" spoke and collided with its label */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skill"
            dataKey="value"
            stroke="hsl(217 91% 60%)"
            fill="hsl(217 91% 60%)"
            fillOpacity={0.4}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
