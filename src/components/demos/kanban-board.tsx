"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

type ColId = "todo" | "doing" | "done";
type Card = { id: number; title: string; tag: string };
type Cols = Record<ColId, Card[]>;

const COLS: { id: ColId; name: string }[] = [
  { id: "todo", name: "未着手" },
  { id: "doing", name: "進行中" },
  { id: "done", name: "完了" },
];

const initial: Cols = {
  todo: [
    { id: 1, title: "デザインレビュー", tag: "UI" },
    { id: 2, title: "API スキーマ設計", tag: "BE" },
    { id: 6, title: "利用規約の改訂", tag: "法務" },
  ],
  doing: [{ id: 3, title: "ヘッダー実装", tag: "FE" }],
  done: [
    { id: 4, title: "リポジトリ作成", tag: "Ops" },
    { id: 5, title: "Tailwind 設定", tag: "FE" },
  ],
};

function locate(cols: Cols, id: number): [ColId, number] {
  for (const c of COLS) {
    const i = cols[c.id].findIndex((x) => x.id === id);
    if (i >= 0) return [c.id, i];
  }
  return ["todo", -1];
}

/** Move card `id` so it ends up at `index` in column `to` (index counted after removal). */
function moveCard(cols: Cols, id: number, to: ColId, index: number): Cols {
  const [from, fi] = locate(cols, id);
  if (fi < 0) return cols;
  const card = cols[from][fi];
  const next: Cols = { ...cols, [from]: cols[from].filter((x) => x.id !== id) };
  const list = [...next[to]];
  list.splice(Math.max(0, Math.min(index, list.length)), 0, card);
  next[to] = list;
  return next;
}

type Drag = { id: number; x0: number; y0: number; dx: number; dy: number; active: boolean };
type Over = { col: ColId; index: number };

export default function KanbanBoard() {
  const [cols, setCols] = useState(initial);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [over, setOver] = useState<Over | null>(null);
  const [grab, setGrab] = useState<{ id: number; snapshot: Cols } | null>(null);
  const [msg, setMsg] = useState("");
  const root = useRef<HTMLDivElement>(null);

  const colName = (c: ColId) => COLS.find((x) => x.id === c)!.name;
  const titleOf = (id: number) => {
    const [c, i] = locate(cols, id);
    return cols[c][i]?.title ?? "";
  };

  // keep keyboard focus on the grabbed card after it moves between columns
  useEffect(() => {
    if (!grab) return;
    root.current?.querySelector<HTMLElement>(`[data-card-id="${grab.id}"]`)?.focus();
  }, [cols, grab]);

  const hitTest = (x: number, y: number): Over | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!el || !root.current?.contains(el)) return null;
    const card = el.closest<HTMLElement>("[data-card-id]");
    const colEl = el.closest<HTMLElement>("[data-col]");
    if (!colEl) return null;
    const col = colEl.dataset.col as ColId;
    if (card) {
      const r = card.getBoundingClientRect();
      const idx = Number(card.dataset.index);
      return { col, index: y > r.top + r.height / 2 ? idx + 1 : idx };
    }
    return { col, index: cols[col].length };
  };

  const onPointerDown = (e: React.PointerEvent, id: number) => {
    if (e.button !== 0 || grab) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, active: false });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    const dy = e.clientY - drag.y0;
    const active = drag.active || Math.hypot(dx, dy) > 4;
    setDrag({ ...drag, dx, dy, active });
    if (active) setOver(hitTest(e.clientX, e.clientY));
  };
  const onPointerUp = () => {
    if (drag?.active && over) {
      const [from, fi] = locate(cols, drag.id);
      const index = from === over.col && fi < over.index ? over.index - 1 : over.index;
      setCols(moveCard(cols, drag.id, over.col, index));
      setMsg(`「${titleOf(drag.id)}」を${colName(over.col)}の ${index + 1} 番目に移動しました`);
    }
    setDrag(null);
    setOver(null);
  };

  const onKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (!grab) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setGrab({ id, snapshot: cols });
        setMsg(`「${titleOf(id)}」を持ち上げました。矢印キーで移動、スペースで確定、Esc で取り消し`);
      }
      return;
    }
    if (grab.id !== id) return;
    const [c, i] = locate(cols, id);
    const ci = COLS.findIndex((x) => x.id === c);
    let to: ColId = c;
    let idx = i;
    if (e.key === "ArrowUp" && i > 0) idx = i - 1;
    else if (e.key === "ArrowDown" && i < cols[c].length - 1) idx = i + 1;
    else if (e.key === "ArrowLeft" && ci > 0) { to = COLS[ci - 1].id; idx = Math.min(i, cols[to].length); }
    else if (e.key === "ArrowRight" && ci < COLS.length - 1) { to = COLS[ci + 1].id; idx = Math.min(i, cols[to].length); }
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setGrab(null);
      setMsg(`「${titleOf(id)}」を${colName(c)}の ${i + 1} 番目に置きました`);
      return;
    } else if (e.key === "Escape") {
      e.preventDefault();
      setCols(grab.snapshot);
      setGrab(null);
      setMsg("移動を取り消しました");
      return;
    } else if (e.key.startsWith("Arrow")) {
      e.preventDefault();
      return;
    } else return;
    e.preventDefault();
    setCols(moveCard(cols, id, to, idx));
    setMsg(`${colName(to)}の ${idx + 1} 番目`);
  };

  return (
    <div className="w-full space-y-2">
      <div className="overflow-x-auto pb-1">
        <div ref={root} className="grid min-w-[480px] grid-cols-3 gap-2">
          {COLS.map(({ id: col, name }) => {
            const list = cols[col];
            const isOver = drag?.active && over?.col === col;
            return (
              <section
                key={col}
                data-col={col}
                aria-label={name}
                className={`min-h-56 rounded-lg border p-2 transition-colors ${isOver ? "border-primary/50 bg-primary/5" : "bg-muted/40"}`}
              >
                <h3 className="mb-2 flex items-center justify-between px-1 text-xs font-medium">
                  <span>{name}</span>
                  <span className="rounded-full bg-background px-1.5 tabular-nums text-muted-foreground">{list.length}</span>
                </h3>
                <ul className="space-y-1.5">
                  {list.map((c, i) => {
                    const dragging = drag?.active && drag.id === c.id;
                    const grabbed = grab?.id === c.id;
                    return (
                      <li key={c.id} className="relative">
                        {isOver && over?.index === i && <div aria-hidden className="absolute -top-1 inset-x-0 h-0.5 rounded bg-primary" />}
                        <button
                          type="button"
                          data-card-id={c.id}
                          data-index={i}
                          aria-roledescription="ドラッグ可能なカード"
                          aria-pressed={grabbed}
                          onPointerDown={(e) => onPointerDown(e, c.id)}
                          onPointerMove={onPointerMove}
                          onPointerUp={onPointerUp}
                          onPointerCancel={() => { setDrag(null); setOver(null); }}
                          onKeyDown={(e) => onKeyDown(e, c.id)}
                          style={dragging ? { transform: `translate(${drag.dx}px, ${drag.dy}px) rotate(1.5deg)` } : undefined}
                          className={`flex w-full touch-none select-none items-start gap-1.5 rounded-md border bg-background p-2 text-left text-xs shadow-xs ${
                            dragging ? "pointer-events-none relative z-10 cursor-grabbing shadow-lg" : "cursor-grab"
                          } ${grabbed ? "ring-2 ring-primary" : ""}`}
                        >
                          <GripVertical className="mt-px size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block">{c.title}</span>
                            <span className="mt-1 inline-block rounded bg-muted px-1 text-[10px] text-muted-foreground">{c.tag}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {isOver && over?.index === list.length && <li aria-hidden className="h-0.5 rounded bg-primary" />}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">ドラッグ（タッチ可）、またはフォーカスしてスペースで持ち上げ → 矢印キーで移動</p>
      <p aria-live="polite" className="sr-only">{msg}</p>
    </div>
  );
}
