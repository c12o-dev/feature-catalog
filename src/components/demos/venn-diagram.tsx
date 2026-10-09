"use client";

export default function VennDiagram() {
  return (
    <svg viewBox="0 0 200 140" className="w-full max-w-xs mx-auto">
      <circle cx="80" cy="70" r="45" fill="hsl(217 91% 60% / 0.4)" stroke="hsl(217 91% 60%)" />
      <circle cx="120" cy="70" r="45" fill="hsl(0 84% 60% / 0.4)" stroke="hsl(0 84% 60%)" />
      <text x="55" y="73" textAnchor="middle" fontSize="11" className="fill-foreground">A</text>
      <text x="100" y="73" textAnchor="middle" fontSize="11" className="fill-foreground">A∩B</text>
      <text x="145" y="73" textAnchor="middle" fontSize="11" className="fill-foreground">B</text>
    </svg>
  );
}
