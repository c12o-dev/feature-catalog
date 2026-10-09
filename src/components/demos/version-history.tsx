"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";

const versions = [
  { v: "v12 (現行)", time: "2分前", who: "あなた", current: true },
  { v: "v11", time: "1時間前", who: "Alice" },
  { v: "v10", time: "昨日 17:42", who: "あなた" },
  { v: "v9", time: "2日前", who: "Bob" },
  { v: "v8", time: "1週間前", who: "Alice" },
];

export default function VersionHistory() {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3 max-w-md">
      <div className="text-xs font-medium flex items-center gap-1.5"><History className="size-3.5" />バージョン履歴</div>
      <ul className="rounded-md border bg-background divide-y">
        {versions.map((v, i) => (
          <li key={v.v}>
            <button onClick={() => setActive(i)} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 hover:bg-accent ${active === i ? "bg-accent" : ""}`}>
              <div className="font-medium tabular-nums">{v.v}</div>
              <div className="text-xs text-muted-foreground flex-1">{v.time} · {v.who}</div>
              {!v.current && active === i && <Button size="xs">復元</Button>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
