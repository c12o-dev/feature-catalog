"use client";

import { useState } from "react";

const options = [
  { label: "TypeScript", v: 412 },
  { label: "JavaScript", v: 280 },
  { label: "Python", v: 220 },
  { label: "Go", v: 88 },
];

export default function Poll() {
  const [voted, setVoted] = useState<number | null>(null);
  const total = options.reduce((s, o) => s + o.v, 0) + (voted !== null ? 1 : 0);
  return (
    <div className="space-y-1.5 max-w-sm">
      <div className="text-sm font-medium mb-1">どの言語が好き？</div>
      {options.map((o, i) => {
        const v = o.v + (voted === i ? 1 : 0);
        const pct = (v / total) * 100;
        const showResult = voted !== null;
        return (
          <button
            key={o.label}
            onClick={() => setVoted(i)}
            disabled={voted !== null}
            className={`relative w-full text-left rounded-md border bg-background overflow-hidden ${voted === i ? "border-primary" : ""}`}
          >
            {showResult && <div className="absolute inset-y-0 left-0 bg-primary/10" style={{ width: `${pct}%` }} />}
            <div className="relative flex items-center px-3 py-1.5 text-sm">
              <span className="flex-1">{o.label}</span>
              {showResult && <span className="text-xs text-muted-foreground tabular-nums">{pct.toFixed(0)}%</span>}
            </div>
          </button>
        );
      })}
      <div className="text-xs text-muted-foreground pt-1">{total.toLocaleString()} 票</div>
    </div>
  );
}
