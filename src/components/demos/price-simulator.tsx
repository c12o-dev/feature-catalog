"use client";

import { useState } from "react";

export default function PriceSimulator() {
  const [users, setUsers] = useState(20);
  const [storage, setStorage] = useState(50);
  const total = users * 200 + storage * 10;
  return (
    <div className="space-y-3 max-w-md">
      <div className="space-y-1">
        <label className="text-xs flex justify-between"><span>ユーザー数</span><span className="tabular-nums">{users}</span></label>
        <input type="range" min="1" max="200" value={users} onChange={(e) => setUsers(+e.target.value)} className="w-full" />
      </div>
      <div className="space-y-1">
        <label className="text-xs flex justify-between"><span>ストレージ (GB)</span><span className="tabular-nums">{storage}</span></label>
        <input type="range" min="1" max="500" value={storage} onChange={(e) => setStorage(+e.target.value)} className="w-full" />
      </div>
      <div className="rounded-md border bg-background p-3 text-center">
        <div className="text-xs text-muted-foreground">月額見積</div>
        <div className="text-2xl font-semibold tabular-nums">¥{total.toLocaleString()}</div>
      </div>
    </div>
  );
}
