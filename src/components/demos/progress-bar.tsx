"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProgressBar() {
  const [v, setV] = useState(0);
  const [running, setRunning] = useState(false);
  const active = running && v < 100;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => setV((x) => Math.min(100, x + 7)), 200);
    return () => clearTimeout(id);
  }, [v, active]);
  return (
    <div className="space-y-2 max-w-md">
      <div className="flex items-baseline justify-between">
        <span className="text-sm">Uploading...</span>
        <span className="text-xs tabular-nums">{v}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${v}%` }} />
      </div>
      <Button size="sm" onClick={() => { setV(0); setRunning(true); }}>開始</Button>
    </div>
  );
}
