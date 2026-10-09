"use client";

import { useEffect, useState } from "react";

export default function CounterTick() {
  const target = 12847;
  const [v, setV] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1500);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="text-center space-y-2">
      <div className="text-5xl font-semibold tabular-nums">{v.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">happy users</div>
    </div>
  );
}
