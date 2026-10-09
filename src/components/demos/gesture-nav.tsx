"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ChevronLeft, ChevronRight, FileText, Mail } from "lucide-react";

type Page = { title: string; render: (go: () => void) => React.ReactNode };

const pages: Page[] = [
  {
    title: "受信トレイ",
    render: (go) => (
      <ul className="divide-y">
        {[["佐藤 美咲", "来週の定例について"], ["高橋 健", "見積書の送付"], ["田中 葵", "資料ありがとうございます"]].map(([n, s], i) => (
          <li key={n}>
            <button onClick={i === 0 ? go : undefined} disabled={i !== 0} className="flex w-full items-center gap-2 px-3 py-2.5 text-left enabled:hover:bg-muted disabled:opacity-60">
              <Mail className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium">{n}</span>
                <span className="block truncate text-xs text-muted-foreground">{s}</span>
              </span>
              {i === 0 && <ChevronRight className="size-3.5 text-muted-foreground" />}
            </button>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "来週の定例について",
    render: (go) => (
      <div className="space-y-3 p-3 text-xs">
        <p className="text-muted-foreground">佐藤 美咲 · 9:12</p>
        <p className="leading-relaxed">お疲れさまです。来週の定例は水曜 14 時に変更になりました。議題を添付します。</p>
        <button onClick={go} className="flex w-full items-center gap-2 rounded-md border p-2 text-left hover:bg-muted">
          <FileText className="size-3.5 text-muted-foreground" />
          <span className="flex-1">議題.pdf</span>
          <ChevronRight className="size-3.5 text-muted-foreground" />
        </button>
      </div>
    ),
  },
  {
    title: "議題.pdf",
    render: () => (
      <div className="space-y-2 p-3">
        {[90, 70, 80, 55, 75, 60].map((w, i) => (
          <div key={i} className="h-2 rounded bg-muted" style={{ width: `${w}%` }} />
        ))}
      </div>
    ),
  },
];

function Screen({ page, go, onBack }: { page: Page; go: () => void; onBack?: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      <div className="flex h-10 shrink-0 items-center gap-1 border-b px-2">
        {onBack ? (
          <button aria-label="戻る" onClick={onBack} className="grid size-7 place-items-center rounded-md hover:bg-muted">
            <ChevronLeft className="size-4" />
          </button>
        ) : (
          <span className="w-1" />
        )}
        <span className="truncate text-xs font-medium">{page.title}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{page.render(go)}</div>
    </div>
  );
}

export default function GestureNav() {
  const [depth, setDepth] = useState(2);
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const drag = useRef<{ x0: number; w: number; moved: boolean } | null>(null);
  const under = useTransform(x, (v) => {
    const w = frame.current?.clientWidth ?? 240;
    return (v / w - 1) * w * 0.3;
  });
  const shade = useTransform(x, (v) => 0.15 * (1 - v / (frame.current?.clientWidth ?? 240)));

  const width = () => frame.current?.clientWidth ?? 240;
  const finishBack = () => {
    setDepth((d) => Math.max(0, d - 1));
    x.jump(0);
  };
  const back = () => {
    if (depth === 0) return;
    if (reduce) return finishBack();
    animate(x, width(), { type: "spring", stiffness: 380, damping: 38, velocity: x.getVelocity() }).then(finishBack);
  };
  const forward = () => {
    if (depth >= pages.length - 1) return;
    setDepth((d) => d + 1);
    if (reduce) return;
    x.jump(width());
    animate(x, 0, { type: "spring", stiffness: 380, damping: 38 });
  };

  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (depth === 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x0: e.clientX, w: width(), moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = Math.max(0, e.clientX - d.x0);
    if (dx > 3) d.moved = true;
    x.set(dx);
  };
  const onUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (!d.moved) return;
    if (x.get() > d.w * 0.35 || x.getVelocity() > 500) back();
    else if (reduce) x.jump(0);
    else animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div ref={frame} className="relative h-72 w-full max-w-[240px] overflow-hidden rounded-[1.75rem] border-4 border-foreground/80 bg-muted shadow-sm">
        {depth > 0 && (
          <motion.div aria-hidden inert style={{ x: under }} className="absolute inset-0">
            <Screen page={pages[depth - 1]} go={() => {}} />
            <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-black" />
          </motion.div>
        )}
        <motion.div key={depth} style={{ x }} className="absolute inset-0 shadow-[-8px_0_16px_-8px_rgba(0,0,0,0.25)]">
          <Screen page={pages[depth]} go={forward} onBack={depth > 0 ? back : undefined} />
        </motion.div>
        {depth > 0 && (
          <button
            aria-label="左端からスワイプして戻る"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onClick={(e) => { if (e.detail === 0) back(); }}
            className="group absolute inset-y-10 left-0 w-5 touch-none focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="absolute left-0.5 top-1/2 h-10 w-1 -translate-y-1/2 rounded-full bg-foreground/15 transition-colors group-hover:bg-foreground/30" />
          </button>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground" aria-live="polite">
        {depth > 0 ? "画面の左端から右へスワイプすると前の画面に戻ります" : "メールを開いて、左端スワイプで戻ってみてください"}
      </p>
    </div>
  );
}
