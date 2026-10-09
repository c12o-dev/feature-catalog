"use client";

export default function Dendrogram() {
  return (
    <svg viewBox="0 0 240 160" className="w-full">
      {/* Leaves */}
      {["A", "B", "C", "D", "E", "F"].map((l, i) => (
        <text key={l} x={30 + i * 36} y="155" textAnchor="middle" fontSize="11" className="fill-foreground">{l}</text>
      ))}
      {/* Lines */}
      <g stroke="currentColor" fill="none" strokeOpacity="0.7">
        <path d="M 30 140 L 30 120 L 66 120 L 66 140" />
        <path d="M 102 140 L 102 130 L 138 130 L 138 140" />
        <path d="M 174 140 L 174 125 L 210 125 L 210 140" />
        <path d="M 48 120 L 48 95 L 120 95 L 120 130" />
        <path d="M 84 95 L 84 70 L 192 70 L 192 125" />
        <path d="M 138 70 L 138 30" />
      </g>
      <circle cx="138" cy="30" r="4" className="fill-blue-500" />
    </svg>
  );
}
