"use client";

import { useState } from "react";

export default function TimePickerDemo() {
  const [h, setH] = useState(14);
  const [m, setM] = useState(30);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div className="rounded-md border bg-background p-3 max-w-xs space-y-2">
      <div className="flex items-center justify-center gap-2 text-2xl font-mono">
        <input type="number" min="0" max="23" value={h} onChange={(e) => setH(+e.target.value)} className="w-16 text-center bg-transparent border rounded px-1" />:
        <input type="number" min="0" max="59" value={m} onChange={(e) => setM(+e.target.value)} className="w-16 text-center bg-transparent border rounded px-1" />
      </div>
      <div className="text-xs text-muted-foreground text-center">タイムゾーン: {tz}</div>
    </div>
  );
}
