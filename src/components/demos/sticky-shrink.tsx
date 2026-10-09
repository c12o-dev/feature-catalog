"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyShrink() {
  const ref = useRef<HTMLDivElement>(null);
  const [shrunk, setShrunk] = useState(false);
  useEffect(() => {
    const el = ref.current!;
    const on = () => setShrunk(el.scrollTop > 30);
    el.addEventListener("scroll", on);
    return () => el.removeEventListener("scroll", on);
  }, []);
  return (
    <div ref={ref} className="rounded-md border bg-background h-44 overflow-y-auto">
      <header className={`sticky top-0 bg-background border-b transition-all ${shrunk ? "h-10 px-3" : "h-16 px-4"} flex items-center font-semibold`}>
        <span className={shrunk ? "text-sm" : "text-lg"}>Logo</span>
      </header>
      <div className="p-4 text-sm space-y-2">
        {Array.from({ length: 15 }, (_, i) => <p key={i}>スクロールでヘッダーが圧縮 — 段落 {i + 1}</p>)}
      </div>
    </div>
  );
}
