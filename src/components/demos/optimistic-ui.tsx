"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, Plus, Trash2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Task = { id: number; title: string; done: boolean };

const INITIAL: Task[] = [
  { id: 1, title: "週次レポートを提出", done: false },
  { id: 2, title: "デザインレビューの資料を共有", done: true },
  { id: 3, title: "請求書の宛名を修正", done: false },
];

const LATENCY = 900;

export default function OptimisticUi() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [pending, setPending] = useState<Record<number, boolean>>({});
  const [fail, setFail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const nextId = useRef(4);

  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach(clearTimeout);
      set.clear();
    };
  }, []);

  /** Apply `optimistic` immediately; after a fake request, keep it or apply `rollback`. */
  const mutate = (
    id: number,
    label: string,
    optimistic: (t: Task[]) => Task[],
    rollback: (t: Task[]) => Task[],
  ) => {
    const willFail = fail;
    setTasks(optimistic);
    setPending((p) => ({ ...p, [id]: true }));
    setError(null);
    const t = setTimeout(() => {
      timers.current.delete(t);
      setPending((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
      if (willFail) {
        setTasks(rollback);
        setError(`「${label}」を保存できなかったため元に戻しました`);
      }
    }, LATENCY);
    timers.current.add(t);
  };

  const flip = (id: number) => (ts: Task[]) => ts.map((x) => (x.id === id ? { ...x, done: !x.done } : x));
  const without = (id: number) => (ts: Task[]) => ts.filter((x) => x.id !== id);

  const toggle = (task: Task) => mutate(task.id, task.title, flip(task.id), flip(task.id));
  const remove = (task: Task) => {
    const index = tasks.findIndex((x) => x.id === task.id);
    mutate(task.id, task.title, without(task.id), (ts) => {
      const n = [...ts];
      n.splice(Math.min(index, n.length), 0, task);
      return n;
    });
  };
  const add = () => {
    const title = draft.trim();
    if (!title) return;
    const id = nextId.current++;
    setDraft("");
    mutate(id, title, (ts) => [...ts, { id, title, done: false }], without(id));
  };

  const anyPending = Object.keys(pending).length > 0;

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium">今日のタスク</div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={fail} onCheckedChange={setFail} aria-label="サーバーを失敗させる" />
          失敗させる
        </label>
      </div>

      <ul className="divide-y rounded-lg border bg-card">
        {tasks.map((task) => {
          const isPending = !!pending[task.id];
          return (
            <li key={task.id} className="flex items-center gap-3 px-3 py-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={task.done}
                aria-label={`${task.title}を完了にする`}
                onClick={() => toggle(task)}
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                  task.done ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-foreground/40",
                )}
              >
                {task.done && <Check className="size-3" />}
              </button>
              <span className={cn("min-w-0 flex-1 truncate text-sm", task.done && "text-muted-foreground line-through")}>
                {task.title}
              </span>
              {isPending && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="size-3 motion-safe:animate-spin" aria-hidden />
                  保存中
                </span>
              )}
              <button
                type="button"
                aria-label={`${task.title}を削除`}
                onClick={() => remove(task)}
                className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          );
        })}
        {tasks.length === 0 && <li className="px-3 py-6 text-center text-xs text-muted-foreground">タスクはありません</li>}
      </ul>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <label htmlFor="optimistic-ui-new" className="sr-only">
          新しいタスク
        </label>
        <input
          id="optimistic-ui-new"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
          }}
          placeholder="タスクを追加"
          className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="inline-flex h-8 items-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          <Plus className="size-3.5" />
          追加
        </button>
      </form>

      <div aria-live="polite" className="min-h-9">
        {error ? (
          <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
            <span className="flex-1">{error}</span>
            <button type="button" aria-label="閉じる" onClick={() => setError(null)} className="shrink-0 opacity-70 hover:opacity-100">
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <p className="px-1 py-2 text-xs text-muted-foreground">
            {anyPending ? "画面は即時に反映済み。裏で保存しています…" : "操作は即座に画面へ反映され、保存は裏で行われます"}
          </p>
        )}
      </div>
    </div>
  );
}
