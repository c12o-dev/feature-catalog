"use client";

import { Trophy } from "lucide-react";

const awards = [
  { p: "Product Hunt", r: "#1 Product of the Day", year: "2026" },
  { p: "G2", r: "Leader Spring", year: "2026" },
  { p: "Capterra", r: "Best Value", year: "2025" },
];

export default function AwardBadge() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {awards.map((a) => (
        <div key={a.p} className="rounded-lg border bg-background p-3 text-center">
          <Trophy className="size-5 text-amber-500 mx-auto mb-1" />
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{a.p}</div>
          <div className="text-xs font-semibold mt-0.5">{a.r}</div>
          <div className="text-[10px] text-muted-foreground">{a.year}</div>
        </div>
      ))}
    </div>
  );
}
