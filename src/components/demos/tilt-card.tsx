"use client";

import { useState } from "react";

export default function TiltCard() {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div className="grid place-items-center py-2">
      <div
        onMouseMove={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = ((e.clientY - r.top) / r.height - 0.5) * -20;
          const y = ((e.clientX - r.left) / r.width - 0.5) * 20;
          setT({ x, y });
        }}
        onMouseLeave={() => setT({ x: 0, y: 0 })}
        style={{ transform: `perspective(800px) rotateX(${t.x}deg) rotateY(${t.y}deg)` }}
        className="size-44 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 grid place-items-center text-white text-xl font-semibold transition-transform"
      >
        3D Tilt
      </div>
    </div>
  );
}
