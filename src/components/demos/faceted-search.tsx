"use client";

import { useState } from "react";

const facets = {
  ブランド: ["Apple", "Sony", "Bose", "Yamaha"],
  価格帯: ["〜¥10k", "¥10-30k", "¥30-100k", "¥100k+"],
  色: ["黒", "白", "シルバー"],
};

export default function FacetedSearch() {
  const [sel, setSel] = useState<Record<string, string[]>>({});
  const toggle = (cat: string, v: string) => setSel((s) => {
    const arr = s[cat] ?? [];
    return { ...s, [cat]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
  });
  const total = Object.values(sel).flat().length;
  return (
    <div className="grid grid-cols-3 gap-3">
      <aside className="space-y-3">
        {Object.entries(facets).map(([cat, vals]) => (
          <div key={cat}>
            <div className="text-xs font-medium mb-1.5">{cat}</div>
            <div className="space-y-1">
              {vals.map((v) => (
                <label key={v} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={(sel[cat] ?? []).includes(v)} onChange={() => toggle(cat, v)} />
                  {v}
                </label>
              ))}
            </div>
          </div>
        ))}
      </aside>
      <div className="col-span-2 rounded-md border bg-background p-3">
        <div className="text-xs text-muted-foreground mb-2">{total ? `${total} 件のフィルタ適用` : "フィルタ未選択"}</div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded bg-muted/50 grid place-items-center text-xs text-muted-foreground">商品 {i}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
