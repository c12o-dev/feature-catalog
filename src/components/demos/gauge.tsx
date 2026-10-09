"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

const R = 50;
const CX = 60;
const CY = 62;
const ARC = Math.PI * R;
const presets = [
  { label: "アイドル", v: 18 },
  { label: "通常", v: 54 },
  { label: "高負荷", v: 88 },
];

const zone = (v: number) =>
  v >= 80
    ? { name: "高負荷", cls: "text-rose-600 dark:text-rose-400" }
    : v >= 60
      ? { name: "注意", cls: "text-amber-600 dark:text-amber-400" }
      : { name: "正常", cls: "text-emerald-600 dark:text-emerald-400" };

export default function Gauge() {
  const reduce = useReducedMotion();
  const [target, setTarget] = useState(72);
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    if (reduce) {
      shownRef.current = target;
      const raf = requestAnimationFrame(() => setShown(target));
      return () => cancelAnimationFrame(raf);
    }
    const ctrl = animate(shownRef.current, target, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (x) => { shownRef.current = x; setShown(x); },
    });
    return () => ctrl.stop();
  }, [target, reduce]);

  // 0 → left (−90°), 100 → right (+90°); needle drawn pointing up and rotated
  const angle = -90 + (shown / 100) * 180;
  const z = zone(target);
  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
      <div className="w-full rounded-lg border bg-card p-4">
        <div className="flex items-baseline justify-between text-xs text-muted-foreground">
          <span>CPU 使用率</span>
          <span className={z.cls}>{z.name}</span>
        </div>
        <svg viewBox="0 0 120 74" className="mx-auto mt-1 w-full max-w-56" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={target} aria-label="CPU 使用率">
          <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} stroke="currentColor" strokeOpacity="0.12" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            className={`${z.cls} transition-colors`}
            stroke="currentColor"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(shown / 100) * ARC} ${ARC}`}
          />
          {ticks.map((t) => {
            const a = Math.PI - (t / 100) * Math.PI;
            const x1 = CX + (R - 9) * Math.cos(a);
            const y1 = CY - (R - 9) * Math.sin(a);
            const x2 = CX + (R - 13) * Math.cos(a);
            const y2 = CY - (R - 13) * Math.sin(a);
            return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />;
          })}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
            <path d={`M ${CX - 2} ${CY} L ${CX} ${CY - 38} L ${CX + 2} ${CY} Z`} className="fill-foreground" />
          </g>
          <circle cx={CX} cy={CY} r="4" className="fill-foreground" />
          <circle cx={CX} cy={CY} r="1.5" className="fill-background" />
          <text x={CX - R} y={CY + 10} textAnchor="middle" className="fill-muted-foreground" fontSize="6">0</text>
          <text x={CX + R} y={CY + 10} textAnchor="middle" className="fill-muted-foreground" fontSize="6">100</text>
        </svg>
        <div className="-mt-1 text-center text-2xl font-semibold tabular-nums">
          {Math.round(shown)}<span className="text-sm font-normal text-muted-foreground">%</span>
        </div>
      </div>
      <div role="group" aria-label="負荷をシミュレート" className="flex gap-1">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-pressed={target === p.v}
            onClick={() => setTarget(p.v)}
            className="rounded-md border px-2.5 py-1 text-xs hover:bg-accent aria-pressed:bg-foreground aria-pressed:text-background"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
