"use client";

export default function ChordDiagram() {
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto">
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeOpacity="0.2" />
      {[
        { a: 20, color: "hsl(217 91% 60%)" }, { a: 80, color: "hsl(142 71% 45%)" },
        { a: 140, color: "hsl(38 92% 50%)" }, { a: 200, color: "hsl(0 84% 60%)" },
        { a: 260, color: "hsl(280 70% 50%)" }, { a: 320, color: "hsl(180 70% 45%)" },
      ].map((p, i) => (
        <circle key={i} cx={100 + 80 * Math.cos((p.a * Math.PI) / 180)} cy={100 + 80 * Math.sin((p.a * Math.PI) / 180)} r="6" fill={p.color} />
      ))}
      <path d="M 175 100 Q 100 100 100 180" stroke="hsl(217 91% 60%)" strokeWidth="2" strokeOpacity="0.6" fill="none" />
      <path d="M 175 100 Q 100 100 25 100" stroke="hsl(142 71% 45%)" strokeWidth="2" strokeOpacity="0.6" fill="none" />
      <path d="M 100 20 Q 100 100 39 145" stroke="hsl(38 92% 50%)" strokeWidth="2" strokeOpacity="0.6" fill="none" />
      <path d="M 161 145 Q 100 100 39 55" stroke="hsl(280 70% 50%)" strokeWidth="2" strokeOpacity="0.6" fill="none" />
    </svg>
  );
}
