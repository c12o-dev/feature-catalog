"use client";

import { Smartphone, Monitor, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const sessions = [
  { device: "MacBook Pro", icon: Monitor, location: "Tokyo, JP", current: true, time: "今" },
  { device: "iPhone 15", icon: Smartphone, location: "Tokyo, JP", time: "5 分前" },
  { device: "Chrome (Windows)", icon: Globe, location: "Osaka, JP", time: "昨日" },
];

export default function ActiveSessions() {
  return (
    <div className="space-y-2 max-w-md">
      <ul className="rounded-md border bg-background divide-y">
        {sessions.map((s, i) => (
          <li key={i} className="flex items-center gap-3 px-3 py-2.5 text-sm">
            <s.icon className="size-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="font-medium flex items-center gap-1.5">{s.device}{s.current && <span className="text-[10px] rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5">この端末</span>}</div>
              <div className="text-xs text-muted-foreground">{s.location} · {s.time}</div>
            </div>
            {!s.current && <Button size="xs" variant="ghost">ログアウト</Button>}
          </li>
        ))}
      </ul>
      <Button size="sm" variant="destructive" className="w-full">他の全端末からサインアウト</Button>
    </div>
  );
}
