"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function InfiniteScroll() {
  const [items, setItems] = useState(() => Array.from({ length: 10 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !loading) {
        setLoading(true);
        setTimeout(() => {
          setItems((it) => [...it, ...Array.from({ length: 5 }, (_, i) => it.length + i + 1)]);
          setLoading(false);
        }, 600);
      }
    }, { rootMargin: "20px" });
    if (sentinel.current) obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [loading]);
  return (
    <div className="rounded-md border bg-background h-56 overflow-y-auto">
      <ul className="divide-y">
        {items.map((n) => <li key={n} className="px-3 py-2 text-sm">アイテム #{n}</li>)}
      </ul>
      <div ref={sentinel} className="p-3 text-center text-xs text-muted-foreground">
        {loading ? <Loader2 className="size-4 animate-spin mx-auto" /> : "↓ スクロールで追加読込"}
      </div>
    </div>
  );
}
