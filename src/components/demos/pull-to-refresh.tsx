"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowDown, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Post = { id: number; name: string; text: string; time: string; hue: string };

const INITIAL: Post[] = [
  { id: 1, name: "高橋 陽菜", text: "新しいカフェ、窓際の席が最高でした ☕", time: "12分前", hue: "bg-sky-500" },
  { id: 2, name: "中村 蓮", text: "今週のリリースノートをまとめました。", time: "35分前", hue: "bg-emerald-500" },
  { id: 3, name: "小林 さくら", text: "朝ラン 5km 完了。涼しくなってきた。", time: "1時間前", hue: "bg-amber-500" },
  { id: 4, name: "山本 湊", text: "デザインレビューのフィードバックありがとうございます！", time: "2時間前", hue: "bg-violet-500" },
];

const INCOMING: Omit<Post, "id" | "time">[] = [
  { name: "伊藤 結衣", text: "週末の勉強会、資料を公開しました。", hue: "bg-rose-500" },
  { name: "渡辺 颯", text: "やっと秋らしい天気になりましたね 🍂", hue: "bg-teal-500" },
  { name: "加藤 葵", text: "新機能のベータ版、触ってみてください。", hue: "bg-indigo-500" },
];

const THRESHOLD = 64;
const MAX_PULL = 110;

export default function PullToRefresh() {
  const [posts, setPosts] = useState(INITIAL);
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [status, setStatus] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const nextIdx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setPull(THRESHOLD);
    setStatus("更新しています");
    timer.current = setTimeout(() => {
      const src = INCOMING[nextIdx.current % INCOMING.length];
      const id = 100 + nextIdx.current;
      nextIdx.current += 1;
      setPosts((p) => [{ ...src, id, time: "たった今" }, ...p]);
      setRefreshing(false);
      setPull(0);
      setStatus("新しい投稿が 1 件あります");
    }, 1200);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (refreshing || (scroller.current?.scrollTop ?? 0) > 0) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startY.current = e.clientY;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    const dy = e.clientY - startY.current;
    if (dy <= 0) {
      if (dragging) setPull(0);
      return;
    }
    if (!dragging) {
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // rubber-band damping
    setPull(Math.min(MAX_PULL, dy * 0.5));
  };

  const onPointerEnd = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (!dragging) return;
    setDragging(false);
    if (pull >= THRESHOLD) refresh();
    else setPull(0);
  };

  const ready = pull >= THRESHOLD;
  const progress = Math.min(1, pull / THRESHOLD);

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">ホーム</span>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          aria-label="フィードを更新"
          className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <RefreshCw className="size-3.5" />
        </button>
      </div>

      <div className="relative h-64">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
          style={{ height: Math.max(pull, 0), opacity: progress }}
        >
          {refreshing ? (
            <>
              <Loader2 className="size-4 motion-safe:animate-spin" />
              更新中…
            </>
          ) : (
            <>
              <ArrowDown
                className={cn("size-4 transition-transform duration-200", ready && "rotate-180")}
              />
              {ready ? "離して更新" : "引っ張って更新"}
            </>
          )}
        </div>
        <div
          ref={scroller}
          onScroll={(e) => setAtTop(e.currentTarget.scrollTop <= 0)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          className={cn(
            "absolute inset-0 overflow-y-auto overscroll-contain bg-card select-none",
            !dragging && "transition-transform duration-300 ease-out"
          )}
          style={{ transform: `translateY(${pull}px)`, touchAction: atTop ? "pan-x pan-down" : "pan-x pan-y" }}
        >
          <ul className="divide-y">
            {posts.map((p) => (
              <li key={p.id} className="flex gap-2.5 px-3 py-2.5">
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium text-white", p.hue)}>
                  {p.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">{p.name}</span>
                    <span className={cn("shrink-0 text-[11px] text-muted-foreground", p.time === "たった今" && "text-primary")}>{p.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t px-3 py-1.5 text-center text-[11px] text-muted-foreground">
        リストを下に引っ張る（マウスはドラッグ）
      </p>
      <span aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  );
}
