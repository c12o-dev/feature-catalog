"use client";

import { useState, useRef } from "react";

const TOTAL = 10000;
const ROW_H = 28;

export default function VirtualList() {
  const [scroll, setScroll] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const visible = 200; // px viewport
  const start = Math.max(0, Math.floor(scroll / ROW_H) - 5);
  const end = Math.min(TOTAL, start + Math.ceil(visible / ROW_H) + 10);
  const rows = Array.from({ length: end - start }, (_, i) => start + i);
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">{TOTAL.toLocaleString()} 行を windowing で描画 (実描画 {rows.length})</div>
      <div ref={ref} role="region" aria-label="仮想リスト" tabIndex={0} onScroll={(e) => setScroll((e.target as HTMLDivElement).scrollTop)} className="rounded-md border bg-background h-52 overflow-y-auto font-mono text-xs">
        <div style={{ height: TOTAL * ROW_H, position: "relative" }}>
          {rows.map((i) => (
            <div key={i} style={{ position: "absolute", top: i * ROW_H, height: ROW_H }} className="px-3 flex items-center w-full">
              row {i.toString().padStart(5, "0")} — content here
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
