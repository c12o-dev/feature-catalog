"use client";

import { useState } from "react";

export default function EnvSwitch() {
  const [env, setEnv] = useState<"test" | "live">("test");
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-xs text-muted-foreground">環境</span>
      <div className="inline-flex rounded-md border bg-background p-0.5">
        <button onClick={() => setEnv("test")} className={`rounded text-xs px-3 py-1 ${env === "test" ? "bg-amber-500 text-white" : ""}`}>Test</button>
        <button onClick={() => setEnv("live")} className={`rounded text-xs px-3 py-1 ${env === "live" ? "bg-emerald-500 text-white" : ""}`}>Live</button>
      </div>
      {env === "test" && <span className="text-xs text-amber-600">⚠ テストモード — 実課金されません</span>}
    </div>
  );
}
