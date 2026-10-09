"use client";

import { useRef, useState } from "react";
import { GripVertical, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Widget = { id: string; title: string; v: string; trend?: string; down?: boolean; wide: boolean };

const initial: Widget[] = [
  { id: "sales", title: "売上", v: "¥1.2M", trend: "+12%", wide: true },
  { id: "new", title: "新規ユーザー", v: "1,284", trend: "+8%", wide: false },
  { id: "mrr", title: "MRR", v: "¥320K", trend: "+5%", wide: false },
  { id: "churn", title: "解約率", v: "1.8%", trend: "-0.3%", down: true, wide: false },
  { id: "active", title: "アクティブ", v: "8,420", wide: false },
];

function move<T>(arr: T[], from: number, to: number) {
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function DashboardGrid() {
  const [items, setItems] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const moveBy = (id: string, delta: number) => {
    const i = items.findIndex((w) => w.id === id);
    const to = Math.max(0, Math.min(items.length - 1, i + delta));
    if (to === i) return;
    setItems(move(items, i, to));
    setMsg(`${items[i].title} を ${to + 1} 番目へ移動しました`);
  };

  const toggleWide = (id: string) => {
    const w = items.find((x) => x.id === id)!;
    setItems(items.map((x) => (x.id === id ? { ...x, wide: !x.wide } : x)));
    setMsg(`${w.title} を${w.wide ? "標準" : "ワイド"}サイズにしました`);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragId) return;
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-widget]");
    const overId = el?.dataset.widget;
    if (!overId || overId === dragId || !gridRef.current?.contains(el)) return;
    const from = items.findIndex((w) => w.id === dragId);
    const to = items.findIndex((w) => w.id === overId);
    setItems(move(items, from, to));
  };

  const endDrag = () => {
    if (dragId) {
      const i = items.findIndex((w) => w.id === dragId);
      setMsg(`${items[i].title} を ${i + 1} 番目に配置しました`);
    }
    setDragId(null);
  };

  return (
    <div className="@container space-y-2">
      <div ref={gridRef} className="grid grid-cols-2 gap-2 @lg:grid-cols-4">
        {items.map((w) => (
          <div
            key={w.id}
            data-widget={w.id}
            className={cn(
              "group relative rounded-lg border bg-card p-3 shadow-xs transition-[box-shadow,opacity]",
              w.wide && "col-span-2",
              dragId === w.id && "opacity-60 shadow-md ring-2 ring-primary/40",
            )}
          >
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0 truncate text-xs text-muted-foreground">{w.title}</div>
              <div className="-mr-1 -mt-1 flex shrink-0">
                <button
                  type="button"
                  aria-label={`${w.title} を${w.wide ? "標準サイズ" : "ワイド"}にする`}
                  onClick={() => toggleWide(w.id)}
                  className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {w.wide ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                </button>
                <button
                  type="button"
                  aria-label={`${w.title} を移動（ドラッグまたは矢印キー）`}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDragId(w.id);
                  }}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); moveBy(w.id, -1); }
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); moveBy(w.id, 1); }
                  }}
                  className="grid size-6 touch-none cursor-grab place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                >
                  <GripVertical className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-1 text-xl font-semibold tabular-nums">{w.v}</div>
            {w.trend && (
              <div className={cn("text-xs tabular-nums", w.down ? "text-sky-700 dark:text-sky-400" : "text-emerald-700 dark:text-emerald-400")}>
                {w.trend}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">つまみをドラッグで並べ替え・アイコンでサイズ変更</p>
      <p aria-live="polite" className="sr-only">{msg}</p>
    </div>
  );
}
