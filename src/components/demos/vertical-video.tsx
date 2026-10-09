"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, ChevronUp, Heart, MessageCircle, Play, Share2 } from "lucide-react";

type Clip = { id: number; user: string; caption: string; likes: number; comments: number; from: string; to: string; shape: "sun" | "wave" | "city" | "leaf" };

const clips: Clip[] = [
  { id: 1, user: "@yuki_trip", caption: "早朝の海、誰もいない時間が好き", likes: 12400, comments: 318, from: "#f59e0b", to: "#be123c", shape: "sun" },
  { id: 2, user: "@kenta.cooks", caption: "3 分でできる出汁巻き卵", likes: 8820, comments: 142, from: "#0ea5e9", to: "#1e3a8a", shape: "wave" },
  { id: 3, user: "@mio_walks", caption: "雨上がりの商店街を散歩", likes: 5310, comments: 87, from: "#6366f1", to: "#0f172a", shape: "city" },
  { id: 4, user: "@greenroom", caption: "モンステラの新芽が開くまで", likes: 21900, comments: 604, from: "#22c55e", to: "#064e3b", shape: "leaf" },
];

const DURATION = 6;

function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useReduce = () =>
  useSyncExternalStore(subscribeReduce, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);

function Art({ clip, t }: { clip: Clip; t: number }) {
  const y = Math.sin(t * 1.2) * 6;
  return (
    <svg viewBox="0 0 90 160" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`vg${clip.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={clip.from} />
          <stop offset="1" stopColor={clip.to} />
        </linearGradient>
      </defs>
      <rect width="90" height="160" fill={`url(#vg${clip.id})`} />
      {clip.shape === "sun" && <><circle cx="45" cy={70 + y} r="18" fill="#fde68a" opacity="0.9" /><rect y="95" width="90" height="65" fill="#7f1d1d" opacity="0.45" /></>}
      {clip.shape === "wave" && <><ellipse cx="45" cy={80 + y} rx="26" ry="14" fill="#fef3c7" opacity="0.9" /><ellipse cx="45" cy={76 + y} rx="18" ry="6" fill="#fbbf24" /></>}
      {clip.shape === "city" && [10, 26, 42, 58, 74].map((x, i) => <rect key={x} x={x} y={80 + (i % 3) * 10 + y * 0.3} width="12" height="80" fill="#1e293b" opacity="0.8" />)}
      {clip.shape === "leaf" && <path d={`M45 ${120} C 15 ${90 + y} 20 ${50 + y} 45 ${40 + y} C 70 ${50 + y} 75 ${90 + y} 45 120 Z`} fill="#bbf7d0" opacity="0.85" />}
    </svg>
  );
}

const fmt = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n.toLocaleString());

export default function VerticalVideo() {
  const reduce = useReduce();
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [note, setNote] = useState("");
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flash = (msg: string) => {
    if (noteTimer.current) clearTimeout(noteTimer.current);
    setNote(msg);
    noteTimer.current = setTimeout(() => setNote(""), 1800);
  };
  useEffect(() => () => { if (noteTimer.current) clearTimeout(noteTimer.current); }, []);

  // track which clip is snapped
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            setIndex(i);
            setTime(0);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    el.querySelectorAll("[data-index]").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // fake playback
  useEffect(() => {
    if (!playing || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setTime((t) => (t + dt >= DURATION ? 0 : t + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduce]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const el = scroller.current;
      if (!el) return;
      const next = Math.min(clips.length - 1, Math.max(0, index + dir));
      el.scrollTo({ top: next * el.clientHeight, behavior: reduce ? "auto" : "smooth" });
    },
    [index, reduce],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
    else if (e.key === " " || e.key === "k") { e.preventDefault(); setPlaying((p) => !p); }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="relative h-[420px] w-full max-w-[236px] overflow-hidden rounded-2xl border bg-black shadow-lg">
        <div
          ref={scroller}
          tabIndex={0}
          onKeyDown={onKeyDown}
          role="region"
          aria-roledescription="縦動画フィード"
          aria-label={`縦動画 ${index + 1} / ${clips.length}（↑↓ で移動、Space で再生/停止）`}
          className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
        >
          {clips.map((c, i) => {
            const isLiked = !!liked[c.id];
            return (
              <section key={c.id} data-index={i} aria-label={`${c.user}: ${c.caption}`} className="relative h-full snap-start snap-always">
                <Art clip={c} t={i === index ? time : 0} />
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "一時停止" : "再生"}
                  className="absolute inset-0 grid place-items-center"
                >
                  {!playing && i === index && (
                    <span className="grid size-12 place-items-center rounded-full bg-black/40 text-white"><Play aria-hidden className="size-6 fill-white" /></span>
                  )}
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pr-12 pt-10 text-white">
                  <div className="text-sm font-semibold">{c.user}</div>
                  <p className="mt-0.5 text-xs text-white/85">{c.caption}</p>
                </div>
                <div className="absolute bottom-6 right-2 flex flex-col items-center gap-3 text-white">
                  <button type="button" aria-pressed={isLiked} aria-label={`いいね（${fmt(c.likes + (isLiked ? 1 : 0))}）`} onClick={() => setLiked((l) => ({ ...l, [c.id]: !l[c.id] }))} className="flex flex-col items-center gap-0.5">
                    <span className="grid size-9 place-items-center rounded-full bg-black/30"><Heart aria-hidden className={`size-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} /></span>
                    <span aria-hidden className="text-[10px] tabular-nums">{fmt(c.likes + (isLiked ? 1 : 0))}</span>
                  </button>
                  <button type="button" aria-label={`コメント（${c.comments} 件）`} onClick={() => flash("コメントを開きました（デモ）")} className="flex flex-col items-center gap-0.5">
                    <span className="grid size-9 place-items-center rounded-full bg-black/30"><MessageCircle aria-hidden className="size-5" /></span>
                    <span aria-hidden className="text-[10px] tabular-nums">{c.comments}</span>
                  </button>
                  <button type="button" aria-label="共有" onClick={() => flash("リンクをコピーしました（デモ）")} className="grid size-9 place-items-center rounded-full bg-black/30">
                    <Share2 aria-hidden className="size-5" />
                  </button>
                </div>
              </section>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex gap-1" aria-hidden>
          {clips.map((c, i) => (
            <span key={c.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
              <span className="block h-full origin-left bg-white" style={{ transform: `scaleX(${i < index ? 1 : i === index ? time / DURATION : 0})` }} />
            </span>
          ))}
        </div>
        <div aria-live="polite" className="pointer-events-none absolute inset-x-3 top-7 flex justify-center">
          {note && <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] text-white">{note}</span>}
        </div>
      </div>
      <div className="hidden flex-col gap-2 sm:flex">
        <button type="button" aria-label="前の動画" disabled={index === 0} onClick={() => go(-1)} className="grid size-9 place-items-center rounded-full border bg-background hover:bg-accent disabled:opacity-40">
          <ChevronUp aria-hidden className="size-4" />
        </button>
        <span className="text-center text-xs tabular-nums text-muted-foreground">{index + 1}/{clips.length}</span>
        <button type="button" aria-label="次の動画" disabled={index === clips.length - 1} onClick={() => go(1)} className="grid size-9 place-items-center rounded-full border bg-background hover:bg-accent disabled:opacity-40">
          <ChevronDown aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
