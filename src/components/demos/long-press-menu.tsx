"use client";

import { useRef, useState } from "react";
import { Copy, Trash2, Share, Edit } from "lucide-react";

export default function LongPressMenu() {
  const [open, setOpen] = useState(false);
  const t = useRef<NodeJS.Timeout | null>(null);
  const start = () => { t.current = setTimeout(() => setOpen(true), 500); };
  const end = () => { if (t.current) clearTimeout(t.current); };
  return (
    <div className="relative">
      <button onMouseDown={start} onMouseUp={end} onMouseLeave={end} className="rounded-md border bg-background p-3 text-sm select-none">
        長押ししてみて (500ms)
      </button>
      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-10 bg-black/30 grid place-items-center">
          <div className="rounded-lg bg-popover shadow-lg p-1 min-w-[12rem]">
            {[{ icon: Copy, l: "コピー" }, { icon: Edit, l: "編集" }, { icon: Share, l: "共有" }, { icon: Trash2, l: "削除", d: true }].map((m) => (
              <button key={m.l} className={`w-full text-left flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-accent ${m.d ? "text-red-600" : ""}`}>
                <m.icon className="size-4" />{m.l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
