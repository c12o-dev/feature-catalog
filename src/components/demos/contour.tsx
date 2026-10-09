"use client";

export default function Contour() {
  return (
    <svg viewBox="0 0 200 140" className="w-full">
      <rect width="200" height="140" className="fill-muted" />
      {/* Concentric "contour" ellipses simulating density */}
      {[0.15, 0.3, 0.45, 0.6, 0.75].reverse().map((op, i) => (
        <ellipse key={i} cx="80" cy="70" rx={70 - i * 12} ry={40 - i * 7} fill={`hsl(0 84% 60% / ${op * 0.4})`} stroke={`hsl(0 84% 60% / ${op})`} strokeWidth="1" />
      ))}
      {[0.15, 0.3, 0.45, 0.6].reverse().map((op, i) => (
        <ellipse key={`b${i}`} cx="155" cy="100" rx={35 - i * 7} ry={20 - i * 4} fill={`hsl(217 91% 60% / ${op * 0.4})`} stroke={`hsl(217 91% 60% / ${op})`} strokeWidth="1" />
      ))}
      <text x="100" y="135" textAnchor="middle" fontSize="10" className="fill-muted-foreground">density overlay</text>
    </svg>
  );
}
