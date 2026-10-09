"use client";

import { useEffect, useState } from "react";
import { MousePointer2 } from "lucide-react";

const peers = [
  { name: "Alice", color: "text-rose-500" },
  { name: "Bob", color: "text-blue-500" },
  { name: "Carol", color: "text-emerald-500" },
];

export default function LiveCursor() {
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT((x) => x + 0.04), 60); return () => clearInterval(id); }, []);
  const positions = peers.map((p, i) => ({
    ...p,
    x: 50 + 30 * Math.sin(t + i * 2),
    y: 50 + 30 * Math.cos(t * 1.3 + i * 1.5),
  }));
  return (
    <div className="relative h-48 rounded-md border bg-background overflow-hidden">
      {positions.map((p) => (
        <div key={p.name} className="absolute pointer-events-none transition-all duration-100" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <MousePointer2 className={`size-5 ${p.color} fill-current`} />
          <div className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] text-white ${p.color.replace("text-", "bg-")}`}>{p.name}</div>
        </div>
      ))}
      <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground">他のメンバーのカーソル</div>
    </div>
  );
}
