"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

const rows = [
  { name: "Alice", role: "admin", joined: "2025-12-04", status: "active" },
  { name: "Bob", role: "editor", joined: "2026-01-12", status: "active" },
  { name: "Carol", role: "viewer", joined: "2026-02-08", status: "invited" },
  { name: "Dan", role: "editor", joined: "2026-03-15", status: "active" },
];

export default function DataTable() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<keyof typeof rows[number]>("name");
  const [dir, setDir] = useState<1 | -1>(1);
  const filtered = rows.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(q.toLowerCase())));
  const sorted = [...filtered].sort((a, b) => (a[sort] > b[sort] ? 1 : -1) * dir);
  const cycle = (k: keyof typeof rows[number]) => { if (sort === k) setDir((d) => (d * -1) as 1 | -1); else { setSort(k); setDir(1); } };
  return (
    <div className="space-y-2">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="フィルタ..." className="w-full rounded-md border bg-background px-3 py-1.5 text-sm" />
      <div className="rounded-md border bg-background overflow-hidden text-sm">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {(["name", "role", "joined", "status"] as const).map((k) => (
                <th key={k} className="text-left p-2 text-xs font-medium">
                  <button onClick={() => cycle(k)} className="inline-flex items-center gap-1">{k} <ArrowUpDown className="size-3 text-muted-foreground" /></button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {sorted.map((r) => (
              <tr key={r.name} className="hover:bg-accent">
                <td className="p-2">{r.name}</td>
                <td className="p-2 text-muted-foreground">{r.role}</td>
                <td className="p-2 tabular-nums text-muted-foreground">{r.joined}</td>
                <td className="p-2"><span className={`text-xs px-1.5 py-0.5 rounded ${r.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
