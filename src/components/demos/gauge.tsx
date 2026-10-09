"use client";

import { useEffect, useState } from "react";

export default function Gauge() {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(78), 100); return () => clearTimeout(t); }, []);

  const angle = -90 + (v / 100) * 180;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-40">
        <path d="M 10 60 A 50 50 0 0 1 110 60" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 10 60 A 50 50 0 0 1 110 60" stroke="hsl(38 92% 50%)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${(v / 100) * 157} 157`} className="transition-[stroke-dasharray] duration-1000 ease-out" />
        <line x1="60" y1="60" x2={60 + 35 * Math.cos((angle * Math.PI) / 180)} y2={60 + 35 * Math.sin((angle * Math.PI) / 180)} stroke="currentColor" strokeWidth="2" className="transition-all duration-1000 ease-out" />
        <circle cx="60" cy="60" r="3" className="fill-foreground" />
      </svg>
      <div className="text-2xl font-semibold tabular-nums -mt-3">{v}<span className="text-sm text-muted-foreground"> km/h</span></div>
    </div>
  );
}
