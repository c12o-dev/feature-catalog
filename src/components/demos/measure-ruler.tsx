"use client";

export default function MeasureRuler() {
  return (
    <div className="relative aspect-video rounded-md border bg-emerald-50 dark:bg-emerald-950/30">
      <svg viewBox="0 0 100 60" className="absolute inset-0 size-full">
        <line x1="20" y1="20" x2="80" y2="40" stroke="hsl(0 84% 60%)" strokeWidth="2" strokeDasharray="2 2" />
        <circle cx="20" cy="20" r="2" fill="hsl(0 84% 60%)" />
        <circle cx="80" cy="40" r="2" fill="hsl(0 84% 60%)" />
        <text x="50" y="32" fontSize="5" textAnchor="middle" className="fill-foreground">1.2 km</text>
      </svg>
    </div>
  );
}
