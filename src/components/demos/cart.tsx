"use client";

import { useState } from "react";
import { Keyboard, Laptop, Minus, Plus, ShoppingBag, Trash2, Usb } from "lucide-react";

const initial = [
  { id: 1, name: "ノート PC スタンド", variant: "シルバー", price: 3980, q: 1, icon: Laptop },
  { id: 2, name: "USB-C ハブ 7in1", variant: "グレー", price: 5800, q: 2, icon: Usb },
  { id: 3, name: "メカニカルキーボード", variant: "茶軸 / JIS", price: 12800, q: 1, icon: Keyboard },
];
const FREE_SHIPPING = 20000;
const SHIPPING = 550;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default function Cart() {
  const [items, setItems] = useState(initial);
  const [msg, setMsg] = useState("");
  const subtotal = items.reduce((s, i) => s + i.price * i.q, 0);
  const count = items.reduce((s, i) => s + i.q, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING;

  const setQty = (id: number, q: number) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, q: Math.max(1, Math.min(9, q)) } : x)));
  const remove = (id: number, name: string) => {
    setItems((xs) => xs.filter((x) => x.id !== id));
    setMsg(`${name} をカートから削除しました`);
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-medium"><ShoppingBag className="size-4" />カート</h3>
        <span className="text-xs tabular-nums text-muted-foreground">{count} 点</span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          カートは空です
          <button onClick={() => { setItems(initial); setMsg("商品を戻しました"); }} className="mt-2 block w-full text-xs font-medium text-foreground underline underline-offset-2">
            サンプル商品を戻す
          </button>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {items.map((it) => (
            <li key={it.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-muted"><it.icon className="size-4 text-muted-foreground" /></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{it.name}</div>
                <div className="text-xs text-muted-foreground">{it.variant} · {yen(it.price)}</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="flex items-center rounded-md border" role="group" aria-label={`${it.name} の数量`}>
                  <button aria-label="1 つ減らす" disabled={it.q <= 1} onClick={() => setQty(it.id, it.q - 1)} className="grid size-7 place-items-center hover:bg-muted disabled:opacity-40">
                    <Minus className="size-3" />
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">{it.q}</span>
                  <button aria-label="1 つ増やす" disabled={it.q >= 9} onClick={() => setQty(it.id, it.q + 1)} className="grid size-7 place-items-center hover:bg-muted disabled:opacity-40">
                    <Plus className="size-3" />
                  </button>
                </div>
                <span className="w-16 text-right text-sm tabular-nums">{yen(it.price * it.q)}</span>
                <button aria-label={`${it.name} を削除`} onClick={() => remove(it.id, it.name)} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <dl className="space-y-1.5 rounded-lg border bg-card p-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">小計</dt><dd className="tabular-nums">{yen(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">送料</dt><dd className="tabular-nums">{shipping === 0 ? "無料" : yen(shipping)}</dd></div>
        {subtotal > 0 && subtotal < FREE_SHIPPING && (
          <p className="text-xs text-muted-foreground">あと <span className="tabular-nums">{yen(FREE_SHIPPING - subtotal)}</span> で送料無料</p>
        )}
        <div className="flex justify-between border-t pt-2 font-semibold"><dt>合計（税込）</dt><dd className="tabular-nums">{yen(subtotal + shipping)}</dd></div>
      </dl>
      <p aria-live="polite" className="sr-only">{msg}</p>
    </div>
  );
}
