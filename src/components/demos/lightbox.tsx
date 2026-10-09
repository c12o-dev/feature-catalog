"use client";

import { useState } from "react";
import { X } from "lucide-react";

const colors = ["from-blue-400 to-purple-400", "from-emerald-400 to-cyan-400", "from-amber-400 to-rose-400", "from-pink-400 to-indigo-400", "from-lime-400 to-emerald-400", "from-rose-400 to-amber-400"];

export default function Lightbox() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {colors.map((c, i) => (
          <button key={i} onClick={() => setOpen(i)} className={`aspect-square rounded bg-gradient-to-br ${c}`} />
        ))}
      </div>
      {open !== null && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4">
          <button onClick={() => setOpen(null)} className="absolute top-4 right-4 size-8 rounded-full bg-white/10 text-white grid place-items-center"><X className="size-4" /></button>
          <div className={`max-w-[80vmin] aspect-square rounded-lg bg-gradient-to-br ${colors[open]}`} />
        </div>
      )}
    </>
  );
}
