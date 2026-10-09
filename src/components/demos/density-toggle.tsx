"use client";

import { useState } from "react";

export default function DensityToggle() {
  const [d, setD] = useState<"comfortable" | "compact">("comfortable");
  const opts = [{ v: "comfortable" as const, l: "Comfortable" }, { v: "compact" as const, l: "Compact" }];
  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-md bg-muted p-1">
        {opts.map((o) => (
          <button key={o.v} onClick={() => setD(o.v)} className={`px-3 py-1 text-xs rounded ${d === o.v ? "bg-background shadow-sm" : "text-muted-foreground"}`}>{o.l}</button>
        ))}
      </div>
      <ul className="rounded-md border bg-background divide-y">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={`px-3 ${d === "compact" ? "py-1" : "py-2.5"} text-sm transition-all`}>項目 {n}</li>
        ))}
      </ul>
    </div>
  );
}
