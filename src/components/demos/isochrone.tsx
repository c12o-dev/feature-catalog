"use client";

export default function Isochrone() {
  return (
    <div className="relative aspect-video rounded-md border bg-emerald-50 dark:bg-emerald-950/30">
      <svg viewBox="0 0 100 60" className="absolute inset-0 size-full">
        {[35, 25, 15, 8].map((r, i) => (
          <ellipse key={r} cx="50" cy="30" rx={r * 1.5} ry={r * 0.9} fill={`hsl(${[120, 60, 30, 0][i]} 70% 50% / 0.2)`} stroke={`hsl(${[120, 60, 30, 0][i]} 70% 50%)`} strokeWidth="0.5" />
        ))}
        <circle cx="50" cy="30" r="2" fill="currentColor" />
      </svg>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] rounded bg-background/80 px-2 py-1">
        <span>5 分</span><span>10 分</span><span>15 分</span><span>20 分</span>
      </div>
    </div>
  );
}
