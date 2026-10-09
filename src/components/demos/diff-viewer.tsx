"use client";

import { useState } from "react";
import { FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Line = { type: "ctx" | "del" | "add"; old?: number; new?: number; t: string };

const lines: Line[] = [
  { type: "ctx", old: 12, new: 12, t: "export function total(items) {" },
  { type: "del", old: 13, t: "  let sum = 0;" },
  { type: "del", old: 14, t: "  for (const i of items) sum += i.price;" },
  { type: "add", new: 13, t: "  if (!Array.isArray(items)) return 0;" },
  { type: "add", new: 14, t: "  const sum = items.reduce((s, i) => s + i.price * i.qty, 0);" },
  { type: "ctx", old: 15, new: 15, t: "  return Math.round(sum);" },
  { type: "ctx", old: 16, new: 16, t: "}" },
];

const rowTone = { ctx: "", del: "bg-red-50 dark:bg-red-950/40", add: "bg-emerald-50 dark:bg-emerald-950/40" };
const gutterTone = { ctx: "text-muted-foreground", del: "bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300", add: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300" };
const sign = { ctx: " ", del: "−", add: "+" };

// Pair deletions with additions for the split view.
function toSplit(ls: Line[]) {
  const rows: { left?: Line; right?: Line }[] = [];
  for (let i = 0; i < ls.length; ) {
    if (ls[i].type === "ctx") {
      rows.push({ left: ls[i], right: ls[i] });
      i++;
      continue;
    }
    const dels: Line[] = [];
    const adds: Line[] = [];
    while (i < ls.length && ls[i].type === "del") dels.push(ls[i++]);
    while (i < ls.length && ls[i].type === "add") adds.push(ls[i++]);
    for (let k = 0; k < Math.max(dels.length, adds.length); k++) rows.push({ left: dels[k], right: adds[k] });
  }
  return rows;
}

function Cell({ l, side }: { l?: Line; side: "old" | "new" }) {
  if (!l) return <td colSpan={2} className="bg-muted/40" />;
  const n = side === "old" ? l.old : l.new;
  return (
    <>
      <td className={cn("w-10 select-none px-2 text-right tabular-nums", gutterTone[l.type])}>{n}</td>
      <td className={cn("whitespace-pre px-2", rowTone[l.type])}>
        <span className="select-none text-muted-foreground">{sign[l.type]} </span>
        {l.t}
      </td>
    </>
  );
}

export default function DiffViewer() {
  const [mode, setMode] = useState<"unified" | "split">("unified");
  const adds = lines.filter((l) => l.type === "add").length;
  const dels = lines.filter((l) => l.type === "del").length;

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
        <div className="flex min-w-0 items-center gap-1.5 text-xs">
          <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate font-mono">src/cart/total.js</span>
          <span className="shrink-0 font-mono text-emerald-700 dark:text-emerald-400">+{adds}</span>
          <span className="shrink-0 font-mono text-red-700 dark:text-red-400">−{dels}</span>
        </div>
        <div className="inline-flex rounded-md bg-muted p-0.5 text-xs" role="group" aria-label="表示方法">
          {(["unified", "split"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn("rounded px-2 py-0.5", mode === m ? "bg-background font-medium shadow-xs" : "text-muted-foreground")}
            >
              {m === "unified" ? "統合" : "左右"}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs leading-6">
          <caption className="sr-only">src/cart/total.js の差分（追加 {adds} 行、削除 {dels} 行）</caption>
          <tbody>
            <tr className="bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
              <td colSpan={mode === "unified" ? 3 : 4} className="px-3">
                @@ -12,5 +12,5 @@ export function total
              </td>
            </tr>
            {mode === "unified"
              ? lines.map((l, i) => (
                  <tr key={i}>
                    <td className={cn("w-9 select-none px-2 text-right tabular-nums", gutterTone[l.type])} aria-label={l.old ? `旧 ${l.old} 行` : undefined}>
                      {l.old}
                    </td>
                    <td className={cn("w-9 select-none px-2 text-right tabular-nums", gutterTone[l.type])} aria-label={l.new ? `新 ${l.new} 行` : undefined}>
                      {l.new}
                    </td>
                    <td className={cn("whitespace-pre px-2", rowTone[l.type])}>
                      <span className="select-none text-muted-foreground">{sign[l.type]} </span>
                      {l.type !== "ctx" && <span className="sr-only">{l.type === "add" ? "追加: " : "削除: "}</span>}
                      {l.t}
                    </td>
                  </tr>
                ))
              : toSplit(lines).map((r, i) => (
                  <tr key={i} className="[&>td:nth-child(2)]:border-r">
                    <Cell l={r.left} side="old" />
                    <Cell l={r.right} side="new" />
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
