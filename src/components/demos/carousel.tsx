"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = ["from-blue-400 to-purple-400", "from-emerald-400 to-cyan-400", "from-amber-400 to-rose-400", "from-pink-400 to-indigo-400"];

export default function Carousel() {
  const [i, setI] = useState(0);
  return (
    <div className="space-y-2">
      <div className="relative aspect-[16/9] rounded-md overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${slides[i]} grid place-items-center text-white text-xl font-semibold`}>Slide {i + 1}</div>
        <button onClick={() => setI((i) => (i + slides.length - 1) % slides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/40 text-white grid place-items-center"><ChevronLeft className="size-4" /></button>
        <button onClick={() => setI((i) => (i + 1) % slides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/40 text-white grid place-items-center"><ChevronRight className="size-4" /></button>
      </div>
      <div className="flex justify-center gap-1.5">
        {slides.map((_, j) => (
          <button key={j} onClick={() => setI(j)} className={`h-1.5 rounded-full transition-all ${i === j ? "w-6 bg-foreground" : "w-1.5 bg-muted"}`} />
        ))}
      </div>
    </div>
  );
}
