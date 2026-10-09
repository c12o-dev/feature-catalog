"use client";

import { useState } from "react";

export default function DatePickerDemo() {
  const today = new Date();
  const [m, setM] = useState(today.getMonth());
  const [y, setY] = useState(today.getFullYear());
  const [picked, setPicked] = useState<string | null>(null);
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array.from({ length: first }, () => null as number | null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const wd = ["日", "月", "火", "水", "木", "金", "土"];
  const prev = () => { if (m === 0) { setM(11); setY((y) => y - 1); } else setM((m) => m - 1); };
  const next = () => { if (m === 11) { setM(0); setY((y) => y + 1); } else setM((m) => m + 1); };
  return (
    <div className="rounded-md border bg-background p-3 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prev} className="size-6 rounded hover:bg-accent text-sm">‹</button>
        <div className="text-sm font-medium">{y} 年 {m + 1} 月</div>
        <button onClick={next} className="size-6 rounded hover:bg-accent text-sm">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {wd.map((d) => <div key={d} className="text-[10px] text-muted-foreground">{d}</div>)}
        {cells.map((d, i) => d ? (
          <button
            key={i}
            onClick={() => setPicked(`${y}-${(m + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`)}
            className={`aspect-square rounded text-xs ${picked && picked.endsWith(d.toString().padStart(2, "0") + "-" + (m + 1).toString().padStart(2, "0")) ? "" : ""} ${picked === `${y}-${(m + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}` ? "bg-foreground text-background" : "hover:bg-accent"}`}
          >{d}</button>
        ) : <div key={i} />)}
      </div>
      {picked && <div className="text-xs text-muted-foreground mt-2 text-center">選択: {picked}</div>}
    </div>
  );
}
