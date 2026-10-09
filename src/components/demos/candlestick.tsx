"use client";

const candles = [
  { o: 100, c: 110, h: 115, l: 95 }, { o: 110, c: 105, h: 112, l: 100 }, { o: 105, c: 120, h: 122, l: 103 },
  { o: 120, c: 118, h: 125, l: 115 }, { o: 118, c: 130, h: 132, l: 116 }, { o: 130, c: 125, h: 134, l: 122 },
  { o: 125, c: 140, h: 142, l: 124 }, { o: 140, c: 138, h: 145, l: 135 }, { o: 138, c: 150, h: 152, l: 137 },
];

export default function Candlestick() {
  const min = Math.min(...candles.map((c) => c.l));
  const max = Math.max(...candles.map((c) => c.h));
  const scale = (v: number) => 140 - ((v - min) / (max - min)) * 130;
  return (
    <svg viewBox="0 0 240 160" className="w-full">
      {candles.map((c, i) => {
        const x = 20 + i * 25;
        const up = c.c > c.o;
        const color = up ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)";
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={scale(c.h)} y2={scale(c.l)} stroke={color} />
            <rect x={x - 6} y={scale(Math.max(c.o, c.c))} width="12" height={Math.abs(scale(c.o) - scale(c.c)) || 1} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}
