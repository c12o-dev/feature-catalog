"use client";

import { useId, useRef, useState } from "react";
import { GanttChart, KanbanSquare, List } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "todo" | "doing" | "done";
type Task = { id: number; title: string; owner: string; status: Status; start: number; len: number };

// Shared data: every view renders the same records. Day 0 = 10/1.
const tasks: Task[] = [
  { id: 1, title: "要件の洗い出し", owner: "佐藤", status: "done", start: 0, len: 3 },
  { id: 2, title: "ワイヤーフレーム", owner: "田中", status: "done", start: 2, len: 3 },
  { id: 3, title: "API 設計", owner: "鈴木", status: "doing", start: 4, len: 4 },
  { id: 4, title: "画面実装", owner: "田中", status: "doing", start: 6, len: 5 },
  { id: 5, title: "結合テスト", owner: "高橋", status: "todo", start: 10, len: 3 },
  { id: 6, title: "リリース準備", owner: "佐藤", status: "todo", start: 12, len: 2 },
];

const DAYS = 14;
const statusLabel: Record<Status, string> = { todo: "未着手", doing: "進行中", done: "完了" };
const statusDot: Record<Status, string> = {
  todo: "bg-muted-foreground/40",
  doing: "bg-amber-500 dark:bg-amber-400",
  done: "bg-emerald-500 dark:bg-emerald-400",
};
const range = (t: Task) => `10/${t.start + 1}〜10/${t.start + t.len}`;

const VIEWS = [
  { id: "list", label: "リスト", icon: List },
  { id: "board", label: "ボード", icon: KanbanSquare },
  { id: "timeline", label: "タイムライン", icon: GanttChart },
] as const;
type View = (typeof VIEWS)[number]["id"];

function ListView() {
  return (
    <ul className="divide-y">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center gap-3 px-3 py-2">
          <span className={cn("size-2 shrink-0 rounded-full", statusDot[t.status])} aria-hidden />
          <span className={cn("min-w-0 flex-1 truncate text-sm", t.status === "done" && "text-muted-foreground line-through")}>{t.title}</span>
          <span className="hidden text-xs text-muted-foreground @md:inline">{t.owner}</span>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{range(t)}</span>
          <span className="sr-only">{statusLabel[t.status]}</span>
        </li>
      ))}
    </ul>
  );
}

function BoardView() {
  return (
    <div className="overflow-x-auto p-2">
      <div className="grid min-w-[480px] grid-cols-3 gap-2">
        {(["todo", "doing", "done"] as Status[]).map((s) => {
          const col = tasks.filter((t) => t.status === s);
          return (
            <section key={s} aria-label={statusLabel[s]} className="rounded-md bg-muted/50 p-2">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-medium">
                <span className={cn("size-2 rounded-full", statusDot[s])} aria-hidden />
                {statusLabel[s]}
                <span className="text-muted-foreground tabular-nums">{col.length}</span>
              </h4>
              <ul className="space-y-1.5">
                {col.map((t) => (
                  <li key={t.id} className="rounded-md border bg-card p-2 shadow-xs">
                    <div className="text-xs font-medium">{t.title}</div>
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>{t.owner}</span>
                      <span className="tabular-nums">{range(t)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TimelineView() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[520px] p-3">
        <div className="mb-1 grid text-[10px] text-muted-foreground tabular-nums" style={{ gridTemplateColumns: `7rem repeat(${DAYS}, 1fr)` }}>
          <span />
          {Array.from({ length: DAYS }, (_, d) => (
            <span key={d} className="text-center">
              {d + 1}
            </span>
          ))}
        </div>
        <ul className="space-y-1.5">
          {tasks.map((t) => (
            <li key={t.id} className="grid items-center" style={{ gridTemplateColumns: "7rem 1fr" }}>
              <span className="truncate pr-2 text-xs">{t.title}</span>
              <div className="relative h-6 rounded bg-muted/40">
                <div
                  className={cn(
                    "absolute inset-y-0.5 flex items-center rounded px-1.5 text-[10px] font-medium",
                    t.status === "done" ? "bg-primary/30 text-foreground" : "bg-primary text-primary-foreground",
                  )}
                  style={{ left: `${(t.start / DAYS) * 100}%`, width: `${(t.len / DAYS) * 100}%` }}
                  title={`${t.title} ${range(t)}`}
                >
                  <span className="truncate">{t.owner}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function GanttView() {
  const [view, setView] = useState<View>("list");
  const base = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % VIEWS.length;
    if (e.key === "ArrowLeft") n = (i - 1 + VIEWS.length) % VIEWS.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = VIEWS.length - 1;
    if (n < 0) return;
    e.preventDefault();
    setView(VIEWS[n].id);
    tabRefs.current[n]?.focus();
  };

  return (
    <div className="@container w-full overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">会員ページ刷新</div>
          <div className="text-xs text-muted-foreground tabular-nums">6 タスク · 10/1〜10/14</div>
        </div>
        <div role="tablist" aria-label="表示形式" className="flex rounded-md bg-muted p-0.5">
          {VIEWS.map((v, i) => {
            const Icon = v.icon;
            const selected = view === v.id;
            return (
              <button
                key={v.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${base}-tab-${v.id}`}
                aria-selected={selected}
                aria-controls={`${base}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setView(v.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "inline-flex items-center gap-1 rounded px-2 py-1 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  selected ? "bg-background font-medium text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" aria-hidden />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${view}`} className="min-h-64">
        {view === "list" && <ListView />}
        {view === "board" && <BoardView />}
        {view === "timeline" && <TimelineView />}
      </div>
    </div>
  );
}
