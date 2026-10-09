"use client";

import { useEffect, useState } from "react";

const segments = [
  "イントロダクション。今日は modern web の機能パターンについて話します。",
  "草チャートやスキルマップ、コマンドパレットなどユーザーから見える機能を全部カバーします。",
  "デモ付きで実装方法も示しているので、すぐ取り入れられます。",
  "それでは始めていきましょう。",
];

export default function TranscriptFollow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % segments.length), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-md border bg-background p-3 space-y-1.5 text-sm max-w-md">
      {segments.map((s, j) => (
        <div key={j} className={`transition-all ${i === j ? "bg-yellow-100 dark:bg-yellow-950/40 font-medium" : "text-muted-foreground"} px-2 py-1 rounded`}>
          {s}
        </div>
      ))}
    </div>
  );
}
