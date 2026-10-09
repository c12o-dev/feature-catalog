"use client";

import { useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";

const ITEM = 48;
const VIEW = 240;
const songs = [
  ["夜明けのプロローグ", "3:42"], ["海辺の街", "4:05"], ["ガラスの午後", "3:18"], ["遠雷", "5:01"],
  ["スロウダンス", "3:56"], ["紙飛行機", "2:49"], ["真夜中の環状線", "4:27"], ["白い息", "3:33"],
  ["風見鶏", "4:12"], ["ひとりごと", "2:58"], ["九月の雨", "4:40"], ["エピローグ", "3:10"],
] as const;
const MIN_Y = -(songs.length * ITEM - VIEW);

const presets = [
  { id: "soft", label: "ゆるい", stiffness: 120, damping: 14 },
  { id: "normal", label: "標準", stiffness: 300, damping: 24 },
  { id: "stiff", label: "かたい", stiffness: 700, damping: 40 },
] as const;

const clamp = (v: number) => Math.max(MIN_Y, Math.min(0, v));
const snap = (v: number) => clamp(Math.round(v / ITEM) * ITEM);

export default function SpringScroll() {
  const reduce = useReducedMotion();
  const [preset, setPreset] = useState<(typeof presets)[number]["id"]>("normal");
  const p = presets.find((x) => x.id === preset)!;
  const y = useMotionValue(0);
  const thumbY = useTransform(y, (v) => (clamp(v) / MIN_Y) * (VIEW - 48));

  const springTo = (target: number) => {
    const t = snap(target);
    if (reduce) y.jump(t);
    else animate(y, t, { type: "spring", stiffness: p.stiffness, damping: p.damping, velocity: y.getVelocity() });
  };

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div role="radiogroup" aria-label="ばねの硬さ" className="inline-flex rounded-md bg-muted p-0.5">
          {presets.map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={preset === o.id}
              onClick={() => setPreset(o.id)}
              className={`rounded px-2 py-1 text-xs ${preset === o.id ? "bg-background font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button aria-label="先頭へスクロール" onClick={() => springTo(0)} className="grid size-7 place-items-center rounded-md border hover:bg-muted">
            <ArrowUpToLine className="size-3.5" />
          </button>
          <button aria-label="末尾へスクロール" onClick={() => springTo(MIN_Y)} className="grid size-7 place-items-center rounded-md border hover:bg-muted">
            <ArrowDownToLine className="size-3.5" />
          </button>
        </div>
      </div>
      <div
        tabIndex={0}
        role="region"
        aria-label="プレイリスト（ドラッグまたは上下キーでスクロール）"
        onKeyDown={(e) => {
          const map: Record<string, number> = { ArrowDown: -ITEM, ArrowUp: ITEM, PageDown: -VIEW + ITEM, PageUp: VIEW - ITEM };
          if (e.key in map) { e.preventDefault(); springTo(y.get() + map[e.key]); }
          if (e.key === "Home") { e.preventDefault(); springTo(0); }
          if (e.key === "End") { e.preventDefault(); springTo(MIN_Y); }
        }}
        className="relative overflow-hidden rounded-lg border bg-card focus-visible:outline-2 focus-visible:outline-ring"
        style={{ height: VIEW }}
      >
        <motion.ul
          drag="y"
          style={{ y }}
          dragConstraints={{ top: MIN_Y, bottom: 0 }}
          dragElastic={reduce ? 0 : 0.35}
          dragMomentum={!reduce}
          dragTransition={{
            power: 0.4,
            timeConstant: 260,
            modifyTarget: snap,
            bounceStiffness: p.stiffness,
            bounceDamping: p.damping,
          }}
          className="touch-none cursor-grab select-none active:cursor-grabbing"
        >
          {songs.map(([title, len], i) => (
            <li key={title} className="flex items-center gap-3 border-b px-3 last:border-b-0" style={{ height: ITEM }}>
              <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm">{title}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{len}</span>
            </li>
          ))}
        </motion.ul>
        <div aria-hidden className="pointer-events-none absolute right-1 top-0 h-full w-1">
          <motion.div style={{ y: thumbY }} className="h-12 w-1 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        ドラッグして離すと、慣性のあと行にスナップ。端を越えるとばねで戻ります（{p.label}: k={p.stiffness} / c={p.damping}）
      </p>
    </div>
  );
}
