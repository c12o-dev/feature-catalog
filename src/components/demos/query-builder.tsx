"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type Cond = { field: string; op: string; value: string };

export default function QueryBuilder() {
  const [conds, setConds] = useState<Cond[]>([
    { field: "status", op: "=", value: "active" },
    { field: "country", op: "in", value: "JP, US" },
  ]);
  const fields = ["status", "country", "plan", "signup_date"];
  const ops = ["=", "!=", "in", "contains"];
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-xs font-medium">条件 (AND)</div>
      <div className="space-y-1.5">
        {conds.map((c, i) => (
          <div key={i} className="flex gap-1.5">
            <select value={c.field} onChange={(e) => setConds((cs) => cs.map((x, j) => j === i ? { ...x, field: e.target.value } : x))} className="rounded-md border bg-background px-2 py-1 text-sm">
              {fields.map((f) => <option key={f}>{f}</option>)}
            </select>
            <select value={c.op} onChange={(e) => setConds((cs) => cs.map((x, j) => j === i ? { ...x, op: e.target.value } : x))} className="rounded-md border bg-background px-2 py-1 text-sm w-16">
              {ops.map((o) => <option key={o}>{o}</option>)}
            </select>
            <input value={c.value} onChange={(e) => setConds((cs) => cs.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className="flex-1 rounded-md border bg-background px-2 py-1 text-sm" />
            <button onClick={() => setConds((cs) => cs.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600 px-1"><X className="size-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => setConds((cs) => [...cs, { field: "status", op: "=", value: "" }])} className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
        <Plus className="size-3" />条件を追加
      </button>
    </div>
  );
}
