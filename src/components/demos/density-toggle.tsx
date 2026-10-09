"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Density = "comfortable" | "compact";
const OPTS: { v: Density; l: string }[] = [
  { v: "comfortable", l: "標準" },
  { v: "compact", l: "コンパクト" },
];

const ROWS = [
  { name: "見積書_株式会社ミナト.pdf", owner: "佐藤", size: "248 KB", date: "10/01" },
  { name: "Q3 売上レポート.xlsx", owner: "高橋", size: "1.2 MB", date: "09/28" },
  { name: "採用ページ_ワイヤー.fig", owner: "鈴木", size: "4.8 MB", date: "09/25" },
  { name: "議事録_定例会議.docx", owner: "田中", size: "86 KB", date: "09/24" },
  { name: "ロゴ_最終版.svg", owner: "伊藤", size: "12 KB", date: "09/20" },
];

export default function DensityToggle() {
  const [d, setD] = useState<Density>("comfortable");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const compact = d === "compact";

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + OPTS.length) % OPTS.length;
    setD(OPTS[next].v);
    refs.current[next]?.focus();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">ファイル</span>
        <div role="radiogroup" aria-label="表示密度" className="inline-flex rounded-md bg-muted p-0.5">
          {OPTS.map((o, i) => (
            <button
              key={o.v}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={d === o.v}
              tabIndex={d === o.v ? 0 : -1}
              onClick={() => setD(o.v)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "rounded px-3 py-1 text-xs transition-colors",
                d === o.v ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className={cn("w-full min-w-[300px]", compact ? "text-xs" : "text-sm")}>
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className={cn("px-3 text-left font-medium", compact ? "py-1" : "py-2")}>名前</th>
              <th scope="col" className={cn("hidden px-3 text-left font-medium sm:table-cell", compact ? "py-1" : "py-2")}>オーナー</th>
              <th scope="col" className={cn("px-3 text-right font-medium", compact ? "py-1" : "py-2")}>サイズ</th>
              <th scope="col" className={cn("px-3 text-right font-medium", compact ? "py-1" : "py-2")}>更新</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ROWS.map((r) => (
              <tr key={r.name} className="hover:bg-muted/40">
                <td className={cn("max-w-0 truncate px-3 transition-[padding]", compact ? "py-1" : "py-3")}>{r.name}</td>
                <td className={cn("hidden px-3 text-muted-foreground sm:table-cell", compact ? "py-1" : "py-3")}>{r.owner}</td>
                <td className={cn("whitespace-nowrap px-3 text-right text-muted-foreground tabular-nums", compact ? "py-1" : "py-3")}>{r.size}</td>
                <td className={cn("whitespace-nowrap px-3 text-right text-muted-foreground tabular-nums", compact ? "py-1" : "py-3")}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
