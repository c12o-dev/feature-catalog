"use client";

const series = [
  { label: "A", min: 10, q1: 25, med: 40, q3: 55, max: 75 },
  { label: "B", min: 20, q1: 35, med: 50, q3: 65, max: 85 },
  { label: "C", min: 5, q1: 18, med: 30, q3: 48, max: 90 },
];

export default function BoxPlot() {
  return (
    <svg viewBox="0 0 240 160" className="w-full">
      {[0, 25, 50, 75, 100].map((g) => (
        <line key={g} x1="40" x2="230" y1={140 - g * 1.2} y2={140 - g * 1.2} stroke="currentColor" strokeOpacity="0.1" />
      ))}
      {series.map((s, i) => {
        const x = 70 + i * 60;
        const y = (v: number) => 140 - v * 1.2;
        return (
          <g key={s.label}>
            <line x1={x} y1={y(s.min)} x2={x} y2={y(s.max)} stroke="currentColor" />
            <line x1={x - 10} x2={x + 10} y1={y(s.min)} y2={y(s.min)} stroke="currentColor" />
            <line x1={x - 10} x2={x + 10} y1={y(s.max)} y2={y(s.max)} stroke="currentColor" />
            <rect x={x - 18} y={y(s.q3)} width="36" height={y(s.q1) - y(s.q3)} fill="hsl(217 91% 60% / 0.5)" stroke="hsl(217 91% 60%)" />
            <line x1={x - 18} x2={x + 18} y1={y(s.med)} y2={y(s.med)} stroke="hsl(217 91% 60%)" strokeWidth="2" />
            <text x={x} y="156" textAnchor="middle" fontSize="10" className="fill-muted-foreground">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
