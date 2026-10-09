"use client";

import { useEffect, useState } from "react";

export default function ReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
  }, []);
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">OS 設定で「アニメーションを減らす」が ON だと尊重</div>
      <div className="flex justify-center">
        <div className={`size-16 rounded-full bg-blue-500 ${reduced ? "" : "animate-bounce"}`} />
      </div>
      <div className="text-xs text-center">現在: {reduced ? "尊重 (アニメ抑制)" : "通常 (バウンドあり)"}</div>
    </div>
  );
}
