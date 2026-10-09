"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const apps = [
  { name: "Zapier", scope: "Read profile, Write workflows", color: "bg-orange-400" },
  { name: "Slack", scope: "Read messages", color: "bg-purple-400" },
  { name: "Old App", scope: "Full access", color: "bg-zinc-400", risky: true },
];

export default function AppPermissions() {
  const [list, setList] = useState(apps);
  return (
    <ul className="space-y-2 max-w-md">
      {list.map((a) => (
        <li key={a.name} className={`flex items-center gap-3 rounded-md border bg-background p-3 ${a.risky ? "border-amber-500" : ""}`}>
          <div className={`size-9 rounded ${a.color} grid place-items-center text-white text-sm font-medium`}>{a.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{a.name}</div>
            <div className="text-xs text-muted-foreground">{a.scope}</div>
          </div>
          <Button size="sm" variant={a.risky ? "destructive" : "ghost"} onClick={() => setList((l) => l.filter((x) => x.name !== a.name))}>解除</Button>
        </li>
      ))}
    </ul>
  );
}
