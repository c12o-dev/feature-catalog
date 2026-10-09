"use client";

import { useState, useRef } from "react";

export default function SplitView() {
  const [pct, setPct] = useState(40);
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const onMove = (e: React.MouseEvent) => {
    if (!drag || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPct(Math.min(80, Math.max(20, ((e.clientX - r.left) / r.width) * 100)));
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseUp={() => setDrag(false)} onMouseLeave={() => setDrag(false)} className="rounded-md border bg-background h-48 overflow-hidden flex">
      <div style={{ width: `${pct}%` }} className="p-3 text-xs text-muted-foreground border-r overflow-y-auto">左ペイン: 一覧</div>
      <div onMouseDown={() => setDrag(true)} className="w-1 bg-border hover:bg-foreground/30 cursor-col-resize" />
      <div className="flex-1 p-3 text-xs text-muted-foreground overflow-y-auto">右ペイン: 詳細</div>
    </div>
  );
}
