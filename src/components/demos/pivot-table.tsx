"use client";

const cols = ["JP", "US", "EU"];
const rows = [
  { region: "Q1", JP: 120, US: 200, EU: 80 },
  { region: "Q2", JP: 140, US: 220, EU: 95 },
  { region: "Q3", JP: 160, US: 250, EU: 110 },
  { region: "Q4", JP: 180, US: 280, EU: 130 },
];

export default function PivotTable() {
  const max = Math.max(...rows.flatMap((r) => cols.map((c) => r[c as keyof typeof r] as number)));
  return (
    <div className="rounded-md border bg-background overflow-hidden text-sm">
      <table className="w-full">
        <thead className="bg-muted/30">
          <tr>
            <th className="p-2 text-left text-xs">期</th>
            {cols.map((c) => <th key={c} className="p-2 text-right text-xs">{c}</th>)}
            <th className="p-2 text-right text-xs">合計</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => {
            const sum = cols.reduce((s, c) => s + (r[c as keyof typeof r] as number), 0);
            return (
              <tr key={r.region}>
                <td className="p-2 font-medium">{r.region}</td>
                {cols.map((c) => {
                  const v = r[c as keyof typeof r] as number;
                  return (
                    <td key={c} className="p-1 relative">
                      <div className="absolute inset-0 bg-blue-500/10" style={{ right: `${100 - (v / max) * 100}%` }} />
                      <div className="relative text-right tabular-nums px-1">{v}</div>
                    </td>
                  );
                })}
                <td className="p-2 text-right tabular-nums font-medium">{sum}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
