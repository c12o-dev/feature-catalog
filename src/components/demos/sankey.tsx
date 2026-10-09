"use client";

export default function Sankey() {
  // Simplified static SVG sankey
  return (
    <svg viewBox="0 0 400 200" className="w-full h-48">
      <defs>
        <linearGradient id="sk1" x1="0" x2="1"><stop offset="0%" stopColor="hsl(217 91% 60% / 0.6)" /><stop offset="100%" stopColor="hsl(142 71% 45% / 0.6)" /></linearGradient>
        <linearGradient id="sk2" x1="0" x2="1"><stop offset="0%" stopColor="hsl(38 92% 50% / 0.6)" /><stop offset="100%" stopColor="hsl(0 84% 60% / 0.6)" /></linearGradient>
      </defs>
      <rect x="0" y="20" width="12" height="80" fill="hsl(217 91% 60%)" />
      <rect x="0" y="110" width="12" height="70" fill="hsl(38 92% 50%)" />
      <rect x="200" y="30" width="12" height="60" fill="hsl(142 71% 45%)" />
      <rect x="200" y="100" width="12" height="60" fill="hsl(0 84% 60%)" />
      <rect x="388" y="40" width="12" height="50" fill="hsl(280 70% 50%)" />
      <rect x="388" y="110" width="12" height="50" fill="hsl(180 70% 45%)" />
      <path d="M 12 60 C 100 60 100 60 200 60" stroke="url(#sk1)" strokeWidth="40" fill="none" />
      <path d="M 12 145 C 100 145 100 130 200 130" stroke="url(#sk2)" strokeWidth="30" fill="none" />
      <path d="M 212 60 C 300 60 300 65 388 65" stroke="hsl(142 71% 45% / 0.5)" strokeWidth="25" fill="none" />
      <path d="M 212 130 C 300 130 300 135 388 135" stroke="hsl(0 84% 60% / 0.5)" strokeWidth="25" fill="none" />
      <text x="20" y="15" fontSize="10" className="fill-muted-foreground">流入元 A</text>
      <text x="20" y="195" fontSize="10" className="fill-muted-foreground">流入元 B</text>
      <text x="220" y="20" fontSize="10" className="fill-muted-foreground">中間 1</text>
      <text x="220" y="180" fontSize="10" className="fill-muted-foreground">中間 2</text>
    </svg>
  );
}
