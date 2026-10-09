"use client";

import { useId, useState } from "react";
import { Bookmark, BookmarkPlus, CircleDot, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Filters = { status: "open" | "closed" | "all"; mine: boolean; label: "all" | "bug" | "feature" };
type View = { id: number; name: string; filters: Filters };

const issues = [
  { id: 482, title: "ログイン後にリダイレクトされない", status: "open", mine: true, label: "bug" },
  { id: 479, title: "CSV 出力に列を追加", status: "open", mine: false, label: "feature" },
  { id: 476, title: "通知設定が保存されない", status: "open", mine: true, label: "bug" },
  { id: 470, title: "ダークモードの配色調整", status: "closed", mine: true, label: "feature" },
  { id: 466, title: "検索結果の並び順がずれる", status: "open", mine: false, label: "bug" },
  { id: 461, title: "請求書 PDF のレイアウト崩れ", status: "closed", mine: false, label: "bug" },
] as const;

const DEFAULT: Filters = { status: "open", mine: false, label: "all" };
const INITIAL_VIEWS: View[] = [
  { id: 1, name: "すべての Open", filters: DEFAULT },
  { id: 2, name: "自分のバグ", filters: { status: "open", mine: true, label: "bug" } },
];

const same = (a: Filters, b: Filters) => a.status === b.status && a.mine === b.mine && a.label === b.label;

export default function SavedView() {
  const [views, setViews] = useState(INITIAL_VIEWS);
  const [activeId, setActiveId] = useState<number | null>(1);
  const [filters, setFilters] = useState<Filters>(DEFAULT);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const id = useId();

  const active = views.find((v) => v.id === activeId);
  const dirty = !active || !same(active.filters, filters);
  const rows = issues.filter(
    (i) => (filters.status === "all" || i.status === filters.status) && (!filters.mine || i.mine) && (filters.label === "all" || i.label === filters.label),
  );

  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const save = () => {
    const n = name.trim();
    if (!n) return;
    const v = { id: (views.at(-1)?.id ?? 0) + 1, name: n, filters };
    setViews((vs) => [...vs, v]);
    setActiveId(v.id);
    setNaming(false);
    setName("");
    setMsg(`ビュー「${n}」を保存しました`);
  };

  const select = "h-7 rounded-md border bg-background px-1.5 text-xs";

  return (
    <div className="@container w-full overflow-hidden rounded-lg border bg-card">
      <div className="grid @lg:grid-cols-[11rem_1fr]">
        <nav aria-label="保存したビュー" className="border-b p-2 @lg:border-b-0 @lg:border-r">
          <div className="mb-1 px-1 text-xs font-medium text-muted-foreground">保存したビュー</div>
          <ul className="flex gap-1 overflow-x-auto @lg:flex-col">
            {views.map((v) => (
              <li key={v.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(v.id);
                    setFilters(v.filters);
                    setMsg("");
                  }}
                  aria-current={activeId === v.id ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
                    activeId === v.id && "bg-muted font-medium",
                  )}
                >
                  <Bookmark className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{v.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1 text-xs">
              <span className="sr-only">状態</span>
              <select className={select} value={filters.status} onChange={(e) => update({ status: e.target.value as Filters["status"] })}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="all">すべての状態</option>
              </select>
            </label>
            <label className="flex items-center gap-1 text-xs">
              <span className="sr-only">ラベル</span>
              <select className={select} value={filters.label} onChange={(e) => update({ label: e.target.value as Filters["label"] })}>
                <option value="all">すべてのラベル</option>
                <option value="bug">bug</option>
                <option value="feature">feature</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <input type="checkbox" checked={filters.mine} onChange={(e) => update({ mine: e.target.checked })} />
              自分の担当
            </label>
          </div>

          <div className="mt-2 flex min-h-8 flex-wrap items-center gap-2">
            {naming ? (
              <form
                className="flex w-full items-center gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
              >
                <label htmlFor={id} className="sr-only">
                  ビュー名
                </label>
                <input
                  id={id}
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
                    if (e.key === "Escape") setNaming(false);
                  }}
                  placeholder="ビュー名"
                  className="h-7 min-w-0 flex-1 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
                <Button type="submit" size="sm" disabled={!name.trim()}>
                  保存
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setNaming(false)}>
                  取消
                </Button>
              </form>
            ) : (
              <>
                {dirty && <span className="text-xs text-amber-700 dark:text-amber-400">{active ? `「${active.name}」から変更あり` : "未保存の条件"}</span>}
                <Button size="sm" variant="outline" disabled={!dirty} onClick={() => setNaming(true)} className="ml-auto">
                  <BookmarkPlus />
                  ビューとして保存
                </Button>
              </>
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            {msg}
          </p>

          <ul className="mt-2 divide-y rounded-md border bg-background">
            {rows.map((i) => (
              <li key={i.id} className="flex items-center gap-2 px-2.5 py-2 text-xs">
                {i.status === "open" ? (
                  <CircleDot className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Open" />
                ) : (
                  <CircleCheck className="size-3.5 shrink-0 text-violet-600 dark:text-violet-400" aria-label="Closed" />
                )}
                <span className="min-w-0 flex-1 truncate">{i.title}</span>
                <span className="shrink-0 text-muted-foreground tabular-nums">#{i.id}</span>
              </li>
            ))}
            {rows.length === 0 && <li className="px-2.5 py-4 text-center text-xs text-muted-foreground">該当する issue はありません</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
