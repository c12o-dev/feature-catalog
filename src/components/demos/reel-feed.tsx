"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronDown, ChevronUp, Heart, MessageCircle, Music, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const reels = [
  { id: 1, user: "@kyoto_walk", text: "朝 6 時の伏見稲荷。人がいない時間帯だけの景色", audio: "オリジナル音源", likes: 12300, comments: 284, bg: "from-orange-400 via-rose-500 to-fuchsia-700", emoji: "⛩️" },
  { id: 2, user: "@hiro_cooks", text: "10 分でできる鶏むね肉の甘酢あん", audio: "Lo-fi Kitchen", likes: 8410, comments: 132, bg: "from-amber-300 via-orange-500 to-red-600", emoji: "🍳" },
  { id: 3, user: "@sea.daily", text: "波の音だけ 15 秒。作業の合間にどうぞ", audio: "波の音", likes: 30100, comments: 902, bg: "from-sky-400 via-cyan-600 to-blue-900", emoji: "🌊" },
  { id: 4, user: "@plant_note", text: "モンステラの新芽が開くまでのタイムラプス", audio: "Morning Light", likes: 5120, comments: 77, bg: "from-lime-300 via-emerald-500 to-teal-800", emoji: "🌱" },
];

const fmt = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n.toLocaleString("ja-JP"));

export default function ReelFeed() {
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);

  const go = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const n = Math.max(0, Math.min(reels.length - 1, i));
    el.scrollTo({ top: n * el.clientHeight, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative aspect-[9/16] w-full max-w-[200px] overflow-hidden rounded-2xl bg-black shadow-lg">
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollTop / el.clientHeight));
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              go(index + 1);
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              go(index - 1);
            }
          }}
          tabIndex={0}
          role="region"
          aria-roledescription="縦スワイプフィード"
          aria-label={`リール ${index + 1} / ${reels.length}（上下キーで移動）`}
          className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 [&::-webkit-scrollbar]:hidden"
        >
          {reels.map((r, i) => {
            const isLiked = liked.includes(r.id);
            return (
              <article
                key={r.id}
                aria-hidden={i !== index}
                className={cn("relative h-full snap-start snap-always bg-gradient-to-b text-white", r.bg)}
              >
                <div className="absolute inset-0 grid place-items-center text-5xl" aria-hidden>
                  {r.emoji}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
                <div className="absolute bottom-14 right-2 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    tabIndex={i === index ? 0 : -1}
                    onClick={() => setLiked((l) => (isLiked ? l.filter((x) => x !== r.id) : [...l, r.id]))}
                    aria-pressed={isLiked}
                    aria-label={isLiked ? "いいねを取り消す" : "いいね"}
                    className="flex flex-col items-center"
                  >
                    <Heart className={cn("size-6 drop-shadow", isLiked && "fill-rose-500 text-rose-500")} />
                    <span className="text-[10px] tabular-nums">{fmt(r.likes + (isLiked ? 1 : 0))}</span>
                  </button>
                  <button type="button" tabIndex={i === index ? 0 : -1} aria-label={`コメント ${r.comments} 件`} className="flex flex-col items-center">
                    <MessageCircle className="size-6 drop-shadow" />
                    <span className="text-[10px] tabular-nums">{r.comments}</span>
                  </button>
                  <button type="button" tabIndex={i === index ? 0 : -1} aria-label="シェア" className="flex flex-col items-center">
                    <Send className="size-6 drop-shadow" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-12 text-xs">
                  <div className="mb-1 font-semibold">{r.user}</div>
                  <p className="line-clamp-2 opacity-90">{r.text}</p>
                  <div className="mt-1 flex items-center gap-1 opacity-80">
                    <Music className="size-3" aria-hidden />
                    <span className="truncate">{r.audio}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="pointer-events-none absolute right-1 top-1/2 flex -translate-y-1/2 flex-col gap-1" aria-hidden>
          {reels.map((r, i) => (
            <span key={r.id} className={cn("w-0.5 rounded-full bg-white transition-all", i === index ? "h-4 opacity-100" : "h-1.5 opacity-50")} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="前のリール"
          className="grid size-8 place-items-center rounded-full border bg-background hover:bg-muted disabled:opacity-40"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === reels.length - 1}
          aria-label="次のリール"
          className="grid size-8 place-items-center rounded-full border bg-background hover:bg-muted disabled:opacity-40"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}
