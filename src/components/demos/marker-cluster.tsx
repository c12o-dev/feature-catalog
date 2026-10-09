"use client";

const clusters = [{ x: 25, y: 35, n: 12 }, { x: 55, y: 50, n: 47 }, { x: 75, y: 30, n: 8 }, { x: 40, y: 70, n: 23 }];

export default function MarkerCluster() {
  return (
    <div className="relative aspect-video rounded-md border bg-emerald-50 dark:bg-emerald-950/30">
      {clusters.map((c, i) => {
        const size = 24 + Math.log2(c.n) * 6;
        return (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/80 ring-4 ring-blue-500/30 grid place-items-center text-white text-xs font-semibold tabular-nums" style={{ left: `${c.x}%`, top: `${c.y}%`, width: size, height: size }}>
            {c.n}
          </div>
        );
      })}
    </div>
  );
}
