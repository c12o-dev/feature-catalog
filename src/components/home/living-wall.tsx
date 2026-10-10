"use client";

import { ViewTransition, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { Xray } from "@/components/shell/xray";
import { cn } from "@/lib/utils";
import { useTick } from "./use-tick";

export type WallTile = { slug: string; code: string; name: string; hue: number };

/*
 * Living Wall (v2-launch §4.1): twelve tiny, self-running renditions of catalog patterns.
 * Built in the shell's own visual language rather than by shrinking the full demos.
 * Every tile is a link that morphs into its pattern page (shared-element view transition).
 */
export function LivingWall({ tiles }: { tiles: WallTile[] }) {
  const t = Object.fromEntries(tiles.map((x) => [x.slug, x]));
  return (
    <div role="group" aria-label="動くパターンの見本" className="grid grid-flow-dense grid-cols-2 gap-2 sm:grid-cols-6 sm:gap-3 [grid-auto-rows:118px] sm:[grid-auto-rows:128px]">
      <Tile t={t["contribution-heatmap"]} className="col-span-2 sm:col-span-4"><Heatmap /></Tile>
      <Tile t={t["progress-ring"]} className="sm:col-span-2 sm:row-span-2"><Ring /></Tile>
      <Tile t={t["streaming-text"]} className="col-span-2 sm:col-span-4"><Streaming /></Tile>
      <Tile t={t["sparkline"]} className="sm:col-span-2"><Spark /></Tile>
      <Tile t={t["number-roll"]} className="sm:col-span-2"><Odometer /></Tile>
      <Tile t={t["live-badge"]} className="sm:col-span-2"><Live /></Tile>
      <Tile t={t["sortable-list"]} className="col-span-2 row-span-2 sm:col-span-3"><Sortable /></Tile>
      <Tile t={t["toggle-switch"]} className="hidden sm:flex sm:col-span-1"><Toggle /></Tile>
      <Tile t={t["gauge"]} className="hidden sm:flex sm:col-span-2"><Gauge /></Tile>
      <Tile t={t["emoji-reactions"]} className="sm:col-span-3"><Reactions /></Tile>
      <Tile t={t["waveform"]} className="hidden sm:flex sm:col-span-4"><Wave /></Tile>
      <Tile t={t["skeleton-fade"]} className="hidden sm:flex sm:col-span-2"><Skeleton /></Tile>
    </div>
  );
}

function Tile({ t, className, children }: { t?: WallTile; className?: string; children: React.ReactNode }) {
  if (!t) return null;
  return (
    <Xray slug={t.slug} place="tl" className={cn("flex", className)}>
      <Link
        href={`/p/${t.slug}`}
        data-hue={t.hue}
        style={{ "--cat-hue": t.hue } as React.CSSProperties}
        className="group/tile relative flex w-full overflow-hidden rounded-xl border border-line-1 bg-bg-1/80 transition-[border-color,transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-cat/50 hover:bg-bg-2 focus-visible:border-cat"
      >
        <ViewTransition name={`stage-${t.slug}`}>
          <span aria-hidden className="absolute inset-0 flex items-center justify-center p-4">
            {children}
          </span>
        </ViewTransition>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1 items-center gap-2 bg-gradient-to-t from-bg-0/95 via-bg-0/70 to-transparent px-3 pt-6 pb-2 text-[11px] opacity-0 transition-all duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100 group-focus-visible/tile:translate-y-0 group-focus-visible/tile:opacity-100">
          <span className="idx text-cat">{t.code}</span>
          <span className="truncate text-fg-1">{t.name}</span>
        </span>
        <span className="sr-only">{t.name}</span>
      </Link>
    </Xray>
  );
}

/* ── tiles ─────────────────────────────────────────────────────────── */

function rng(seed: number) {
  let x = seed;
  return () => ((x = (x * 9301 + 49297) % 233280) / 233280);
}
const HEAT = (() => {
  const r = rng(7);
  return Array.from({ length: 7 * 26 }, () => {
    const v = r();
    return v < 0.38 ? 0 : v < 0.62 ? 1 : v < 0.82 ? 2 : v < 0.94 ? 3 : 4;
  });
})();

function Heatmap() {
  const { n, reduced } = useTick(140);
  const head = reduced ? 30 : n % 30;
  return (
    <span className="grid w-full grid-flow-col grid-rows-7 gap-[3px]">
      {HEAT.map((v, i) => {
        const col = Math.floor(i / 7);
        const lit = col <= head;
        const lvl = lit ? v : 0;
        return (
          <span
            key={i}
            className="aspect-square rounded-[2px] transition-colors duration-300"
            style={{ background: lvl ? `oklch(${0.42 + lvl * 0.11} ${0.07 + lvl * 0.025} var(--cat-hue))` : "rgb(255 255 255 / 0.05)" }}
          />
        );
      })}
    </span>
  );
}

function Ring() {
  const { n, reduced } = useTick(2600);
  const pct = reduced ? 0.82 : [0.82, 0.36, 0.64, 0.95][n % 4];
  const C = 2 * Math.PI * 40;
  return (
    <span className="relative flex size-full max-h-44 max-w-44 items-center justify-center">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="9" />
        <circle
          cx="50" cy="50" r="40" fill="none" stroke="var(--cat)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <span className="absolute font-mono text-2xl text-fg-1 tabular-nums">{Math.round(pct * 100)}<span className="text-sm text-fg-3">%</span></span>
    </span>
  );
}

const SENTENCE = "楽観的 UI は、サーバーの応答を待たずに結果を先に描く。失敗したら静かに巻き戻す。";
function Streaming() {
  const { n, reduced } = useTick(55);
  const len = reduced ? SENTENCE.length : Math.min(SENTENCE.length, n % (SENTENCE.length + 40));
  return (
    <span className="w-full self-start text-left">
      <span className="mb-2 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-fg-3 uppercase">
        <span className="size-1.5 rounded-full bg-cat" /> streaming
      </span>
      <span className="block text-sm leading-relaxed text-fg-2 sm:text-[15px]">
        {SENTENCE.slice(0, len)}
        <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] bg-cat motion-safe:animate-pulse" />
      </span>
    </span>
  );
}

const SPARK = [12, 18, 14, 22, 19, 27, 24, 31, 28, 36, 33, 41];
function Spark() {
  const { n } = useTick(900);
  const data = SPARK.map((v, i) => v + ((i * 7 + n * 5) % 9) - 4);
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${36 - ((v - min) / (max - min)) * 30}`);
  const last = pts[pts.length - 1].split(",");
  return (
    <span className="flex w-full flex-col gap-1">
      <span className="flex items-baseline justify-between font-mono text-[11px] text-fg-3"><span>MRR</span><span className="text-cat">+{data[data.length - 1] - data[0]}%</span></span>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-12 w-full overflow-visible">
        <polyline points={pts.join(" ")} fill="none" stroke="var(--cat)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
        <circle cx={last[0]} cy={last[1]} r="2.2" fill="var(--cat)" style={{ transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </svg>
    </span>
  );
}

const ODO = [1284, 1290, 1307, 1311, 1342, 1389];
function Odometer() {
  const { n, reduced } = useTick(1800);
  const v = String(ODO[reduced ? 0 : n % ODO.length]).padStart(4, "0");
  return (
    <span className="flex items-center font-mono text-4xl text-fg-1 tabular-nums">
      {v.split("").map((d, i) => (
        <span key={i} className="relative h-[1.15em] w-[0.62em] overflow-hidden">
          <span className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[var(--ease-out-expo)]" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {Array.from({ length: 10 }, (_, k) => <span key={k} className="h-[1.15em] leading-[1.15em]">{k}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
}

function Live() {
  const { n } = useTick(1300);
  const viewers = 2481 + ((n * 37) % 120);
  return (
    <span className="flex flex-col items-center gap-2">
      <span className="flex items-center gap-1.5 rounded-sm bg-[#d4252b] px-2 py-0.5 font-mono text-[11px] font-semibold tracking-widest text-white">
        <span className="relative flex size-1.5"><span className="absolute inline-flex size-full rounded-full bg-white opacity-75 motion-safe:animate-ping" /><span className="relative inline-flex size-1.5 rounded-full bg-white" /></span>
        LIVE
      </span>
      <span className="font-mono text-xs text-fg-3 tabular-nums">{viewers.toLocaleString("ja-JP")} 人が視聴中</span>
    </span>
  );
}

const ITEMS = [
  { id: "a", t: "デザインレビュー", c: "oklch(0.78 0.12 250)" },
  { id: "b", t: "API 契約の確定", c: "oklch(0.8 0.13 75)" },
  { id: "c", t: "Lighthouse 95 以上", c: "oklch(0.78 0.13 150)" },
  { id: "d", t: "リリースノート", c: "oklch(0.75 0.14 25)" },
];
const ORDERS = [[0, 1, 2, 3], [1, 0, 2, 3], [1, 2, 0, 3], [3, 1, 2, 0], [0, 1, 2, 3]];
function Sortable() {
  const { n, reduced } = useTick(1700);
  const order = ORDERS[reduced ? 0 : n % ORDERS.length];
  const els = useRef(new Map<string, HTMLElement>());
  const tops = useRef(new Map<string, number>());

  // FLIP: after each reorder, play every row from its old position to its new one.
  // (Hand-rolled so the home page doesn't ship a motion library for one list.)
  useLayoutEffect(() => {
    for (const [id, el] of els.current) {
      const top = el.offsetTop;
      const prev = tops.current.get(id);
      tops.current.set(id, top);
      if (reduced || prev === undefined || prev === top) continue;
      el.animate([{ transform: `translateY(${prev - top}px)` }, { transform: "none" }], { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    }
  }, [order, reduced]);

  return (
    <span className="flex w-full flex-col gap-1.5 self-center">
      {order.map((i) => (
        <span
          key={ITEMS[i].id}
          ref={(el) => {
            if (el) els.current.set(ITEMS[i].id, el);
            else els.current.delete(ITEMS[i].id);
          }}
          className="flex items-center gap-2.5 rounded-md border border-line-1 bg-bg-2 px-3 py-2 text-[13px] text-fg-2"
        >
          <span className="grid grid-cols-2 gap-[2px] opacity-40">{Array.from({ length: 6 }, (_, k) => <span key={k} className="size-[3px] rounded-full bg-fg-2" />)}</span>
          <span className="size-2 rounded-full" style={{ background: ITEMS[i].c }} />
          {ITEMS[i].t}
        </span>
      ))}
    </span>
  );
}

function Toggle() {
  const { n } = useTick(1500);
  const on = n % 2 === 0;
  return (
    <span className={cn("relative h-7 w-12 rounded-full transition-colors duration-300", on ? "bg-cat" : "bg-white/12")}>
      <span className={cn("absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform duration-300 ease-[var(--ease-out-expo)]", on && "translate-x-5")} />
    </span>
  );
}

function Gauge() {
  const { n, reduced } = useTick(2200);
  const v = reduced ? 0.68 : [0.68, 0.32, 0.87, 0.54][n % 4];
  const a = -90 + v * 180;
  return (
    <span className="relative flex w-full max-w-40 flex-col items-center">
      <svg viewBox="0 0 100 56" className="w-full">
        <path d="M8 50 A42 42 0 0 1 92 50" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="8" strokeLinecap="round" />
        <path d="M8 50 A42 42 0 0 1 92 50" fill="none" stroke="var(--cat)" strokeWidth="8" strokeLinecap="round" pathLength={100} strokeDasharray={`${v * 100} 100`} style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
        <g style={{ transform: `rotate(${a}deg)`, transformOrigin: "50px 50px", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)" }}>
          <line x1="50" y1="50" x2="50" y2="16" stroke="var(--fg-1)" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="50" r="3.5" fill="var(--fg-1)" />
      </svg>
      <span className="font-mono text-xs text-fg-3 tabular-nums">{Math.round(v * 120)} ms</span>
    </span>
  );
}

const EMOJI = ["👍", "🎉", "👀", "🔥"];
function Reactions() {
  const { n } = useTick(900);
  const hit = n % EMOJI.length;
  return (
    <span className="flex flex-wrap items-center justify-center gap-2">
      {EMOJI.map((e, i) => {
        const count = 3 + i * 4 + Math.floor((n + (EMOJI.length - i)) / EMOJI.length);
        const active = i === hit && n > 0;
        return (
          <span key={e} className={cn("relative flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors duration-300", active ? "border-cat/60 bg-cat-dim text-fg-1" : "border-line-2 text-fg-2")}>
            <span className={cn("transition-transform duration-300", active && "scale-125")}>{e}</span>
            <span className="font-mono text-xs tabular-nums">{count}</span>
          </span>
        );
      })}
    </span>
  );
}

const BARS = Array.from({ length: 28 }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));
function Wave() {
  const { n } = useTick(160);
  const head = n % BARS.length;
  return (
    <span className="flex h-14 w-full items-center gap-[3px]">
      {BARS.map((h, i) => (
        <span key={i} className="flex-1 rounded-full transition-[background-color,transform] duration-200" style={{ height: `${h * 100}%`, background: i <= head ? "var(--cat)" : "rgb(255 255 255 / 0.12)", transform: i === head ? "scaleY(1.15)" : undefined }} />
      ))}
    </span>
  );
}

function Skeleton() {
  const { n, reduced } = useTick(2000);
  const loaded = reduced || n % 2 === 1;
  return (
    <span className="relative flex w-full flex-col gap-2">
      <span className={cn("flex flex-col gap-2 transition-opacity duration-500", loaded ? "opacity-0" : "opacity-100")}>
        <span className="h-2.5 w-3/4 rounded bg-white/10 motion-safe:animate-pulse" />
        <span className="h-2.5 w-full rounded bg-white/10 motion-safe:animate-pulse" />
        <span className="h-2.5 w-1/2 rounded bg-white/10 motion-safe:animate-pulse" />
      </span>
      <span className={cn("absolute inset-0 text-[11px] leading-[1.45] text-fg-2 transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}>
        読み込み完了。レイアウトは動かない。
      </span>
    </span>
  );
}
