"use client";

import { useEffect, useRef, useState } from "react";

export default function Parallax() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    const on = () => setY(el.scrollTop);
    el.addEventListener("scroll", on);
    return () => el.removeEventListener("scroll", on);
  }, []);
  return (
    <div ref={ref} className="rounded-md border h-44 overflow-y-auto relative">
      <div className="absolute inset-x-0 h-72 bg-gradient-to-br from-blue-400 to-purple-500" style={{ top: 0, transform: `translateY(${y * 0.3}px)` }} />
      <div className="relative h-72 grid place-items-center text-white text-lg font-semibold">スクロールしてみる</div>
      <div className="relative bg-background p-3 text-sm">背景は遅れて動きます (parallax)</div>
    </div>
  );
}
