"use client";

import { useState } from "react";

const opts = ["日", "週", "月", "年"];

export default function SegmentedControl() {
  const [v, setV] = useState("週");
  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-lg bg-muted p-1">
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => setV(o)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              v === o ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">選択中: {v}</div>
    </div>
  );
}
