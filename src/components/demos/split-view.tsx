"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MIN = 25;
const MAX = 75;
const mails = [
  { from: "高橋 遼", subject: "来週の定例について", body: "来週の定例は水曜 14 時に変更になりました。議題があれば前日までに共有してください。" },
  { from: "経理チーム", subject: "9 月分の経費精算", body: "9 月分の経費精算の締め切りは 10 月 5 日です。領収書の添付を忘れずにお願いします。" },
  { from: "佐藤 美咲", subject: "デザインレビューの資料", body: "レビュー用の資料をアップしました。特にオンボーディングの 3 画面目にご意見ください。" },
  { from: "山田 健", subject: "リリースノート案", body: "v2.4 のリリースノート案です。表現の揺れがないか確認をお願いします。" },
];

export default function SplitView() {
  const [pct, setPct] = useState(42);
  const [drag, setDrag] = useState(false);
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));
  const fromPointer = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPct(clamp(((clientX - r.left) / r.width) * 100));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPct((p) => clamp(p - step));
    else if (e.key === "ArrowRight") setPct((p) => clamp(p + step));
    else if (e.key === "Home") setPct(MIN);
    else if (e.key === "End") setPct(MAX);
    else return;
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <div ref={ref} className={cn("flex h-60 overflow-hidden rounded-lg border bg-card", drag && "cursor-col-resize select-none")}>
        <div id="split-left" style={{ width: `${pct}%` }} className="min-w-0 overflow-y-auto">
          <ul className="divide-y">
            {mails.map((m, i) => (
              <li key={m.subject}>
                <button
                  type="button"
                  onClick={() => setSel(i)}
                  aria-current={sel === i ? "true" : undefined}
                  className={cn("w-full px-3 py-2 text-left transition-colors", sel === i ? "bg-accent" : "hover:bg-muted/60")}
                >
                  <span className="block truncate text-xs text-muted-foreground">{m.from}</span>
                  <span className="block truncate text-sm font-medium">{m.subject}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="ペインの幅を調整"
          aria-controls="split-left"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrag(true);
          }}
          onPointerMove={(e) => drag && fromPointer(e.clientX)}
          onPointerUp={() => setDrag(false)}
          onPointerCancel={() => setDrag(false)}
          onDoubleClick={() => setPct(42)}
          className="group relative w-px shrink-0 cursor-col-resize touch-none bg-border outline-none"
        >
          <span className="absolute inset-y-0 -left-2 -right-2" aria-hidden />
          <span
            aria-hidden
            className={cn(
              "absolute left-1/2 top-1/2 h-8 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background transition-colors group-hover:bg-muted group-focus-visible:ring-2 group-focus-visible:ring-ring",
              drag && "bg-muted",
            )}
          />
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto p-4">
          <p className="text-xs text-muted-foreground">{mails[sel].from}</p>
          <h3 className="mt-1 text-sm font-semibold">{mails[sel].subject}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mails[sel].body}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        境界をドラッグ、またはフォーカスして ←/→ で調整（{Math.round(pct)}% / ダブルクリックで戻す）
      </p>
    </div>
  );
}
