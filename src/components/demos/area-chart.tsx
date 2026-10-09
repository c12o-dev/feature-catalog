"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

// 30 日分の日次アクティブ数（決定的）
const data = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}日`,
  v: Math.round(50 + 30 * Math.sin(i / 4) + i * 1.5),
}));

const MODES = [
  { id: "monotone", label: "エリア" },
  { id: "stepAfter", label: "階段" },
] as const;

type Mode = (typeof MODES)[number]["id"];

const H = 180;

export default function AreaChartDemo() {
  const [mode, setMode] = useState<Mode>("monotone");
  return (
    <div className="w-full space-y-3 text-blue-600 dark:text-blue-400">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium text-foreground">
          日次アクティブ <span className="text-xs font-normal text-muted-foreground">10月</span>
        </div>
        <div
          role="radiogroup"
          aria-label="グラフの種類"
          className="inline-flex rounded-md border bg-muted p-0.5 text-xs text-foreground"
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            const next = mode === "monotone" ? "stepAfter" : "monotone";
            setMode(next);
            e.currentTarget.querySelector<HTMLButtonElement>(`[data-mode=${next}]`)?.focus();
          }}
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              data-mode={m.id}
              aria-checked={mode === m.id}
              tabIndex={mode === m.id ? 0 : -1}
              onClick={() => setMode(m.id)}
              className={cn("rounded px-2.5 py-1", mode === m.id ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: H }}>
        <ResponsiveContainer width="100%" height={H} initialDimension={{ width: 320, height: H }}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="area-chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="d" interval={6} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [v, "アクティブ"]}
            />
            <Area type={mode} dataKey="v" stroke="currentColor" strokeWidth={2} fill="url(#area-chart-fill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
