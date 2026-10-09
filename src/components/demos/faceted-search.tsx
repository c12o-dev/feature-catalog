"use client";

import { useState } from "react";
import { Headphones, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = { id: number; name: string; brand: string; price: number; color: string };

const products: Product[] = [
  { id: 1, name: "Aria ワイヤレス", brand: "Lumen", price: 8900, color: "黒" },
  { id: 2, name: "Aria Pro", brand: "Lumen", price: 24800, color: "白" },
  { id: 3, name: "Studio 7", brand: "Kanade", price: 39800, color: "黒" },
  { id: 4, name: "Studio 7 Lite", brand: "Kanade", price: 19800, color: "シルバー" },
  { id: 5, name: "Nami ノイキャン", brand: "Hibiki", price: 32800, color: "白" },
  { id: 6, name: "Nami Mini", brand: "Hibiki", price: 9800, color: "黒" },
  { id: 7, name: "Orbit オープン", brand: "Sora", price: 14800, color: "シルバー" },
  { id: 8, name: "Orbit Max", brand: "Sora", price: 54800, color: "黒" },
];

const PRICE = [
  { label: "〜¥10,000", test: (p: number) => p < 10000 },
  { label: "¥10,000〜30,000", test: (p: number) => p >= 10000 && p < 30000 },
  { label: "¥30,000〜", test: (p: number) => p >= 30000 },
];

type Sel = { brand: string[]; price: string[]; color: string[] };
const EMPTY: Sel = { brand: [], price: [], color: [] };

const FACETS: { key: keyof Sel; label: string; values: string[] }[] = [
  { key: "brand", label: "ブランド", values: ["Lumen", "Kanade", "Hibiki", "Sora"] },
  { key: "price", label: "価格帯", values: PRICE.map((p) => p.label) },
  { key: "color", label: "カラー", values: ["黒", "白", "シルバー"] },
];

const match = (p: Product, key: keyof Sel, vals: string[]) => {
  if (!vals.length) return true;
  if (key === "brand") return vals.includes(p.brand);
  if (key === "color") return vals.includes(p.color);
  return PRICE.some((r) => vals.includes(r.label) && r.test(p.price));
};

const filter = (sel: Sel, except?: keyof Sel) =>
  products.filter((p) => FACETS.every((f) => f.key === except || match(p, f.key, sel[f.key])));

const swatch: Record<string, string> = { 黒: "bg-neutral-800", 白: "bg-white border", シルバー: "bg-neutral-300" };

export default function FacetedSearch() {
  const [sel, setSel] = useState<Sel>(EMPTY);
  const toggle = (k: keyof Sel, v: string) =>
    setSel((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));
  const results = filter(sel);
  const active = FACETS.flatMap((f) => sel[f.key].map((v) => ({ k: f.key, v })));

  return (
    <div className="@container w-full">
      <div className="grid gap-4 @lg:grid-cols-[11rem_1fr]">
        <aside aria-label="絞り込み" className="grid grid-cols-2 gap-x-4 gap-y-3 @lg:grid-cols-1">
          {FACETS.map((f) => {
            // Counts reflect the other facets' selections (standard faceted behaviour).
            const base = filter(sel, f.key);
            return (
              <fieldset key={f.key} className="min-w-0">
                <legend className="mb-1.5 text-xs font-medium">{f.label}</legend>
                <div className="space-y-1">
                  {f.values.map((v) => {
                    const count = base.filter((p) => match(p, f.key, [v])).length;
                    const checked = sel[f.key].includes(v);
                    return (
                      <label key={v} className={cn("flex cursor-pointer items-center gap-2 text-xs", !count && !checked && "opacity-40")}>
                        <input type="checkbox" className="size-3.5 accent-current" checked={checked} onChange={() => toggle(f.key, v)} />
                        <span className="min-w-0 flex-1 truncate">{v}</span>
                        <span className="text-muted-foreground tabular-nums">{count}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </aside>

        <section className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {results.length} 件
            </span>
            {active.map(({ k, v }) => (
              <button
                key={k + v}
                type="button"
                onClick={() => toggle(k, v)}
                aria-label={`${v} の絞り込みを解除`}
                className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs hover:bg-muted"
              >
                {v}
                <X className="size-3" aria-hidden />
              </button>
            ))}
            {active.length > 0 && (
              <button type="button" onClick={() => setSel(EMPTY)} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                すべて解除
              </button>
            )}
          </div>
          {results.length ? (
            <ul className="grid grid-cols-2 gap-2 @md:grid-cols-3">
              {results.map((p) => (
                <li key={p.id} className="rounded-md border bg-card p-2">
                  <div className="grid aspect-[4/3] place-items-center rounded bg-muted/60">
                    <Headphones className="size-6 text-muted-foreground" aria-hidden />
                  </div>
                  <div className="mt-1.5 truncate text-xs font-medium">{p.name}</div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{p.brand}</span>
                    <span className={cn("size-2.5 rounded-full", swatch[p.color])} role="img" aria-label={p.color} />
                  </div>
                  <div className="text-xs tabular-nums">¥{p.price.toLocaleString("ja-JP")}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-dashed p-6 text-center text-xs text-muted-foreground">条件に合う商品がありません</p>
          )}
        </section>
      </div>
    </div>
  );
}
