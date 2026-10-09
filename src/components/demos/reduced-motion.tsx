"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const m = matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

export default function ReducedMotion() {
  const reduced = useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
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
