"use client";

import { Zap } from "lucide-react";

const trace = [
  { step: "1. router", model: "haiku", in: 312, out: 22, ms: 180 },
  { step: "2. retrieve", model: "embed", in: 22, out: 0, ms: 90 },
  { step: "3. answer", model: "sonnet", in: 1850, out: 412, ms: 2100 },
];

export default function TokenTrace() {
  const totalIn = trace.reduce((s, t) => s + t.in, 0);
  const totalOut = trace.reduce((s, t) => s + t.out, 0);
  const totalMs = trace.reduce((s, t) => s + t.ms, 0);
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium flex items-center gap-1.5">
        <Zap className="size-3.5 text-amber-500" />LLM trace
      </div>
      <div className="rounded-md border bg-background overflow-hidden">
        <div className="grid grid-cols-5 text-[10px] uppercase tracking-wide text-muted-foreground bg-muted/30 px-3 py-1.5 gap-2">
          <div>step</div><div>model</div><div className="text-right">in</div><div className="text-right">out</div><div className="text-right">ms</div>
        </div>
        {trace.map((t) => (
          <div key={t.step} className="grid grid-cols-5 text-xs px-3 py-1.5 gap-2 border-t">
            <div>{t.step}</div>
            <div className="font-mono">{t.model}</div>
            <div className="text-right tabular-nums">{t.in}</div>
            <div className="text-right tabular-nums">{t.out}</div>
            <div className="text-right tabular-nums">{t.ms}</div>
          </div>
        ))}
        <div className="grid grid-cols-5 text-xs px-3 py-1.5 gap-2 border-t font-medium bg-muted/20">
          <div>total</div><div></div>
          <div className="text-right tabular-nums">{totalIn}</div>
          <div className="text-right tabular-nums">{totalOut}</div>
          <div className="text-right tabular-nums">{totalMs}</div>
        </div>
      </div>
    </div>
  );
}
