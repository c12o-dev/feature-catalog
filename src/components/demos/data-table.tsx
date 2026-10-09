"use client";

import { Fragment, useId, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = { name: string; role: "管理者" | "編集者" | "閲覧者"; joined: string; status: "有効" | "招待中" };

const ROWS: Row[] = [
  { name: "青木 翔", role: "管理者", joined: "2025-12-04", status: "有効" },
  { name: "伊藤 結衣", role: "編集者", joined: "2026-01-12", status: "有効" },
  { name: "上田 蓮", role: "閲覧者", joined: "2026-02-08", status: "招待中" },
  { name: "江口 さくら", role: "編集者", joined: "2026-03-15", status: "有効" },
  { name: "小川 大輝", role: "閲覧者", joined: "2026-04-21", status: "有効" },
  { name: "加藤 陽菜", role: "編集者", joined: "2026-05-30", status: "招待中" },
  { name: "木村 悠真", role: "管理者", joined: "2026-07-02", status: "有効" },
];

type Key = keyof Row;
const COLS: { key: Key; label: string }[] = [
  { key: "name", label: "名前" },
  { key: "role", label: "権限" },
  { key: "joined", label: "参加日" },
  { key: "status", label: "状態" },
];
const GROUPS: { key: "" | "role" | "status"; label: string }[] = [
  { key: "", label: "なし" },
  { key: "role", label: "権限" },
  { key: "status", label: "状態" },
];

export default function DataTable() {
  const id = useId();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Key>("joined");
  const [dir, setDir] = useState<1 | -1>(1);
  const [group, setGroup] = useState<"" | "role" | "status">("");
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const needle = q.trim().toLowerCase();
  const filtered = ROWS.filter((r) => !needle || Object.values(r).some((v) => v.toLowerCase().includes(needle)));
  const sorted = [...filtered].sort((a, b) => a[sort].localeCompare(b[sort], "ja") * dir);
  const groups: [string, Row[]][] = group
    ? Array.from(
        sorted.reduce((m, r) => m.set(r[group], [...(m.get(r[group]) ?? []), r]), new Map<string, Row[]>()),
      ).sort((a, b) => a[0].localeCompare(b[0], "ja"))
    : [["", sorted]];

  const cycle = (k: Key) => {
    if (sort === k) setDir(dir === 1 ? -1 : 1);
    else {
      setSort(k);
      setDir(1);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-0 flex-1 basis-40 items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-ring/50">
          <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <span className="sr-only">メンバーを絞り込む</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="名前・権限で絞り込み" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
        <div role="radiogroup" aria-labelledby={`${id}-g`} className="flex items-center gap-1 text-xs">
          <span id={`${id}-g`} className="mr-1 text-muted-foreground">グループ</span>
          {GROUPS.map((g) => (
            <button
              key={g.key}
              type="button"
              role="radio"
              aria-checked={group === g.key}
              onClick={() => {
                setGroup(g.key);
                setCollapsed([]);
              }}
              className={cn("rounded-md border px-2 py-1 transition-colors", group === g.key ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted")}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-muted/50">
            <tr>
              {COLS.map((c) => {
                const on = sort === c.key;
                const Icon = !on ? ArrowUpDown : dir === 1 ? ArrowUp : ArrowDown;
                return (
                  <th key={c.key} scope="col" aria-sort={on ? (dir === 1 ? "ascending" : "descending") : "none"} className="p-0 text-left text-xs font-medium">
                    <button type="button" onClick={() => cycle(c.key)} className={cn("inline-flex w-full items-center gap-1 px-3 py-2 hover:text-foreground", on ? "text-foreground" : "text-muted-foreground")}>
                      {c.label}
                      <Icon aria-hidden className="size-3" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {groups.map(([g, rows]) => {
              const isCollapsed = collapsed.includes(g);
              return (
                <Fragment key={g || "all"}>
                  {group && (
                    <tr className="border-t bg-muted/30">
                      <th colSpan={4} scope="rowgroup" className="p-0 text-left">
                        <button
                          type="button"
                          aria-expanded={!isCollapsed}
                          onClick={() => setCollapsed(isCollapsed ? collapsed.filter((x) => x !== g) : [...collapsed, g])}
                          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                        >
                          <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", isCollapsed && "-rotate-90")} />
                          {g}
                          <span className="font-normal text-muted-foreground tabular-nums">{rows.length} 件</span>
                        </button>
                      </th>
                    </tr>
                  )}
                  {!isCollapsed &&
                    rows.map((r) => (
                      <tr key={r.name} className="border-t transition-colors hover:bg-muted/40">
                        <td className="whitespace-nowrap px-3 py-2 font-medium">{r.name}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.role}</td>
                        <td className="whitespace-nowrap px-3 py-2 tabular-nums text-muted-foreground">{r.joined}</td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <span className={cn("rounded px-1.5 py-0.5 text-xs", r.status === "有効" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground")}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              );
            })}
            {sorted.length === 0 && (
              <tr className="border-t">
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-muted-foreground">一致するメンバーがいません</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
        {sorted.length} / {ROWS.length} 件を表示
      </p>
    </div>
  );
}
