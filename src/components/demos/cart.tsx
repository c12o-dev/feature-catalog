"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

const initial = [
  { id: 1, name: "ノート PC スタンド", price: 3980, q: 1 },
  { id: 2, name: "USB-C ハブ", price: 5800, q: 2 },
  { id: 3, name: "メカニカルキーボード", price: 12800, q: 1 },
];

export default function Cart() {
  const [items, setItems] = useState(initial);
  const subtotal = items.reduce((s, i) => s + i.price * i.q, 0);
  return (
    <div className="space-y-2 max-w-md">
      <ul className="rounded-md border bg-background divide-y">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3 px-3 py-2">
            <div className="size-10 rounded bg-muted shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{it.name}</div>
              <div className="text-xs text-muted-foreground">¥{it.price.toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setItems((it) => it.map((x) => x.id === it[0].id ? x : x).map((x) => x.id === items[0].id ? x : x))} className="hidden" />
              <button onClick={() => setItems((items) => items.map((x) => x.id === it.id ? { ...x, q: Math.max(1, x.q - 1) } : x))} className="rounded border p-0.5"><Minus className="size-3" /></button>
              <span className="text-sm font-mono tabular-nums w-6 text-center">{it.q}</span>
              <button onClick={() => setItems((items) => items.map((x) => x.id === it.id ? { ...x, q: x.q + 1 } : x))} className="rounded border p-0.5"><Plus className="size-3" /></button>
            </div>
            <button onClick={() => setItems((items) => items.filter((x) => x.id !== it.id))} className="text-muted-foreground hover:text-red-600"><Trash2 className="size-3.5" /></button>
          </li>
        ))}
      </ul>
      <div className="rounded-md border bg-background p-3 flex justify-between text-sm">
        <span>小計</span>
        <span className="font-semibold tabular-nums">¥{subtotal.toLocaleString()}</span>
      </div>
    </div>
  );
}
