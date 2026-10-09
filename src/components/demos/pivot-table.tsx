"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

type Dim = "region" | "quarter" | "category";
type Rec = Record<Dim, string> & { sales: number };

const DIMS: Record<Dim, { label: string; values: string[] }> = {
  region: { label: "地域", values: ["関東", "関西", "九州"] },
  quarter: { label: "四半期", values: ["Q1", "Q2", "Q3", "Q4"] },
  category: { label: "カテゴリ", values: ["家具", "家電", "雑貨"] },
};

// deterministic mock records (sales in 万円)
const RECORDS: Rec[] = (() => {
  const out: Rec[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  DIMS.region.values.forEach((region, ri) =>
    DIMS.quarter.values.forEach((quarter, qi) =>
      DIMS.category.values.forEach((category, ci) => {
        out.push({ region, quarter, category, sales: Math.round((120 - ri * 30 + qi * 14 + ci * 10) * (0.8 + rnd() * 0.4)) });
      }),
    ),
  );
  return out;
})();

const fmt = (n: number) => n.toLocaleString("ja-JP");

export default function PivotTable() {
  const [rowDim, setRowDim] = useState<Dim>("quarter");
  const [colDim, setColDim] = useState<Dim>("region");

  const changeRow = (d: Dim) => {
    if (d === colDim) setColDim(rowDim);
    setRowDim(d);
  };
  const changeCol = (d: Dim) => {
    if (d === rowDim) setRowDim(colDim);
    setColDim(d);
  };

  const { cells, rowTotals, colTotals, grand, max } = useMemo(() => {
    const cells: Record<string, number> = {};
    const rowTotals: Record<string, number> = {};
    const colTotals: Record<string, number> = {};
    let grand = 0;
    for (const r of RECORDS) {
      const k = `${r[rowDim]}|${r[colDim]}`;
      cells[k] = (cells[k] ?? 0) + r.sales;
      rowTotals[r[rowDim]] = (rowTotals[r[rowDim]] ?? 0) + r.sales;
      colTotals[r[colDim]] = (colTotals[r[colDim]] ?? 0) + r.sales;
      grand += r.sales;
    }
    return { cells, rowTotals, colTotals, grand, max: Math.max(...Object.values(cells)) };
  }, [rowDim, colDim]);

  const rows = DIMS[rowDim].values;
  const cols = DIMS[colDim].values;
  const unused = (Object.keys(DIMS) as Dim[]).find((d) => d !== rowDim && d !== colDim)!;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2 text-xs">
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">行</span>
          <select
            value={rowDim}
            onChange={(e) => changeRow(e.target.value as Dim)}
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            {(Object.keys(DIMS) as Dim[]).map((d) => (
              <option key={d} value={d}>{DIMS[d].label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setRowDim(colDim);
            setColDim(rowDim);
          }}
          aria-label="行と列を入れ替え"
          className="grid size-8 place-items-center rounded-md border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeftRight className="size-4" />
        </button>
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">列</span>
          <select
            value={colDim}
            onChange={(e) => changeCol(e.target.value as Dim)}
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            {(Object.keys(DIMS) as Dim[]).map((d) => (
              <option key={d} value={d}>{DIMS[d].label}</option>
            ))}
          </select>
        </label>
        <span className="pb-2 text-muted-foreground">
          値: 売上合計（万円）・{DIMS[unused].label}は合算
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-[280px] text-sm">
          <caption className="sr-only">
            {DIMS[rowDim].label} × {DIMS[colDim].label} の売上クロス集計
          </caption>
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                {DIMS[rowDim].label} ＼ {DIMS[colDim].label}
              </th>
              {cols.map((c) => (
                <th key={c} scope="col" className="px-3 py-2 text-right text-xs font-medium">{c}</th>
              ))}
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium">合計</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r}>
                <th scope="row" className="px-3 py-2 text-left font-medium">{r}</th>
                {cols.map((c) => {
                  const v = cells[`${r}|${c}`] ?? 0;
                  return (
                    <td key={c} className="relative px-3 py-2 text-right tabular-nums">
                      <span
                        className="absolute inset-y-1 right-1 rounded-sm bg-sky-500/15 dark:bg-sky-400/20"
                        style={{ width: `calc(${(v / max) * 100}% - 0.5rem)` }}
                        aria-hidden
                      />
                      <span className="relative">{fmt(v)}</span>
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-right font-medium tabular-nums">{fmt(rowTotals[r])}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-muted/30">
            <tr>
              <th scope="row" className="px-3 py-2 text-left text-xs font-medium">合計</th>
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 text-right font-medium tabular-nums">{fmt(colTotals[c])}</td>
              ))}
              <td className="px-3 py-2 text-right font-semibold tabular-nums">{fmt(grand)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
