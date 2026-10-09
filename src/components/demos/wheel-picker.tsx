"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const ITEM_H = 36;
const VIEW_H = ITEM_H * 5;
const PAD = (VIEW_H - ITEM_H) / 2;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function Wheel({
  label,
  values,
  initial,
  onChange,
}: {
  label: string;
  values: number[];
  initial: number;
  onChange: (v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(initial);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = initial * ITEM_H;
  }, [initial]);

  const scrollToIdx = (i: number) => {
    const clamped = Math.max(0, Math.min(values.length - 1, i));
    ref.current?.scrollTo({ top: clamped * ITEM_H, behavior: reduce ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, Math.min(values.length - 1, Math.round(el.scrollTop / ITEM_H)));
    if (i !== idx) {
      setIdx(i);
      onChange(values[i]);
    }
  };

  const fmt = (v: number) => String(v).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`${label}を1つ戻す`}
        onClick={() => scrollToIdx(idx - 1)}
        disabled={idx === 0}
        className="grid h-6 w-10 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
      >
        <ChevronUp className="size-4" />
      </button>
      <div
        ref={ref}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={values[0]}
        aria-valuemax={values[values.length - 1]}
        aria-valuenow={values[idx]}
        aria-valuetext={`${values[idx]}${label}`}
        onScroll={onScroll}
        onKeyDown={(e) => {
          const map: Record<string, number> = {
            ArrowUp: idx - 1,
            ArrowDown: idx + 1,
            PageUp: idx - 3,
            PageDown: idx + 3,
            Home: 0,
            End: values.length - 1,
          };
          if (e.key in map) {
            e.preventDefault();
            scrollToIdx(map[e.key]);
          }
        }}
        className="relative w-16 snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-md outline-none [scrollbar-width:none] focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-scrollbar]:hidden"
        style={{
          height: VIEW_H,
          maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        }}
      >
        <div style={{ height: PAD }} aria-hidden />
        {values.map((v, i) => {
          const d = Math.abs(i - idx);
          return (
            <div
              key={v}
              aria-hidden
              onClick={() => scrollToIdx(i)}
              className={cn(
                "grid snap-center cursor-pointer place-items-center font-mono tabular-nums transition-[color,opacity,transform] duration-150",
                d === 0 ? "text-xl font-semibold text-foreground" : d === 1 ? "scale-90 text-base text-muted-foreground" : "scale-75 text-base text-muted-foreground/60"
              )}
              style={{ height: ITEM_H }}
            >
              {fmt(v)}
            </div>
          );
        })}
        <div style={{ height: PAD }} aria-hidden />
      </div>
      <button
        type="button"
        aria-label={`${label}を1つ進める`}
        onClick={() => scrollToIdx(idx + 1)}
        disabled={idx === values.length - 1}
        className="grid h-6 w-10 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
      >
        <ChevronDown className="size-4" />
      </button>
    </div>
  );
}

export default function WheelPicker() {
  const [h, setH] = useState(7);
  const [m, setM] = useState(30);
  return (
    <div className="mx-auto w-full max-w-xs space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">アラーム</span>
        <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
          {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")} に鳴ります
        </span>
      </div>
      <div className="relative flex items-center justify-center gap-1">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-md border bg-muted/60"
          style={{ height: ITEM_H }}
        />
        <div className="relative">
          <Wheel label="時" values={HOURS} initial={7} onChange={setH} />
        </div>
        <span aria-hidden className="relative font-mono text-xl font-semibold">:</span>
        <div className="relative">
          <Wheel label="分" values={MINUTES} initial={6} onChange={setM} />
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">スクロール・スワイプ・矢印キーで選択</p>
    </div>
  );
}
