"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function ServiceStatus() {
  const [incident, setIncident] = useState(false);
  return (
    <div className="space-y-2 max-w-md">
      <button onClick={() => setIncident((i) => !i)} className="text-xs text-muted-foreground">障害をシミュレート</button>
      <div className={`rounded-md border-l-4 p-3 ${incident ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"}`}>
        <div className="flex items-center gap-2 text-sm font-medium">
          {incident ? <AlertTriangle className="size-4 text-amber-500" /> : <CheckCircle2 className="size-4 text-emerald-500" />}
          {incident ? "一部機能で障害が発生中" : "すべて正常稼働中"}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {incident ? "API 応答が遅延しています。状況: 調査中" : "過去 90 日間の uptime: 99.97%"}
        </div>
      </div>
    </div>
  );
}
