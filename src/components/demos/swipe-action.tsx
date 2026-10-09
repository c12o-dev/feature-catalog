"use client";

import { useState } from "react";
import { Trash2, Archive } from "lucide-react";

export default function SwipeAction() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [{ id: 1, t: "新着メール 1" }, { id: 2, t: "通知" }, { id: 3, t: "DM" }];
  return (
    <ul className="rounded-md border bg-background divide-y overflow-hidden max-w-md">
      {items.map((it) => (
        <li key={it.id} className="relative bg-background overflow-hidden">
          <div className="absolute right-0 inset-y-0 flex">
            <button className="bg-amber-500 text-white px-3 grid place-items-center"><Archive className="size-4" /></button>
            <button className="bg-red-500 text-white px-3 grid place-items-center"><Trash2 className="size-4" /></button>
          </div>
          <button
            onClick={() => setOpen(open === it.id ? null : it.id)}
            className="relative w-full text-left bg-background p-3 text-sm transition-transform"
            style={{ transform: open === it.id ? "translateX(-104px)" : "translateX(0)" }}
          >
            {it.t}
          </button>
        </li>
      ))}
    </ul>
  );
}
