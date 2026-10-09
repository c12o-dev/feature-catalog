"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TARGET = 12847;
const DURATION = 1600;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261001);

function useCountUp(target: number, run: number, reduced: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, reduced]);
  return reduced ? target : v;
}

function RollDigit({ d }: { d: number }) {
  return (
    <span className="relative inline-block h-[1.15em] w-[0.62em] overflow-hidden align-bottom">
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ transform: `translateY(-${d * 1.15}em)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex h-[1.15em] items-center justify-center">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function Odometer({ value }: { value: number }) {
  const chars = value.toLocaleString("en-US").split("");
  // key from the right so existing digits keep their column when length grows
  return (
    <span className="inline-flex font-semibold tabular-nums" aria-hidden>
      {chars.map((c, i) => {
        const key = chars.length - i;
        return c === "," ? (
          <span key={`c${key}`} className="w-[0.3em] text-center">,</span>
        ) : (
          <RollDigit key={`d${key}`} d={Number(c)} />
        );
      })}
    </span>
  );
}

export default function CounterTick() {
  const reduced = !!useReducedMotion();
  const [run, setRun] = useState(0);
  const count = useCountUp(TARGET, run, reduced);
  const [stars, setStars] = useState(48219);

  return (
    <div className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-2">
      <section className="rounded-lg border bg-card p-4">
        <div className="text-xs text-muted-foreground">カウントアップ</div>
        <div className="mt-2 text-4xl font-semibold tracking-tight tabular-nums" aria-hidden>
          {count.toLocaleString("ja-JP")}
        </div>
        <span className="sr-only">登録ユーザー {TARGET.toLocaleString("ja-JP")} 人</span>
        <div className="mt-1 text-sm text-muted-foreground">登録ユーザー</div>
        <Button size="sm" variant="outline" className="mt-4" onClick={() => setRun((r) => r + 1)}>
          <RotateCcw /> もう一度
        </Button>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <div className="text-xs text-muted-foreground">桁ロール</div>
        <div className="mt-2 text-4xl leading-none tracking-tight">
          <Odometer value={stars} />
        </div>
        <div className="mt-1 text-sm text-muted-foreground" aria-live="polite">
          <span className="sr-only">スター {stars.toLocaleString("ja-JP")}</span>
          <span aria-hidden>スター数</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={() => setStars((s) => s + 7 + Math.floor(rand() * 180))}
        >
          <Plus /> スターを追加
        </Button>
      </section>
    </div>
  );
}
