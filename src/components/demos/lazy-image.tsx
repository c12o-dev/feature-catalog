"use client";

import { useState, useEffect, useRef } from "react";

const colors = ["from-blue-400 to-cyan-400", "from-emerald-400 to-lime-400", "from-amber-400 to-rose-400", "from-purple-400 to-pink-400", "from-indigo-400 to-blue-400", "from-teal-400 to-emerald-400"];

function LazyTile({ i, color }: { i: number; color: string }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setLoaded(true), 300); obs.disconnect(); }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="aspect-video rounded overflow-hidden bg-muted">
      {loaded ? <div className={`size-full bg-gradient-to-br ${color}`} /> : <div className="size-full grid place-items-center text-[10px] text-muted-foreground">loading #{i}</div>}
    </div>
  );
}

export default function LazyImage() {
  return (
    <div className="rounded-md border bg-background h-56 overflow-y-auto p-2">
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 12 }, (_, i) => <LazyTile key={i} i={i + 1} color={colors[i % colors.length]} />)}
      </div>
    </div>
  );
}
