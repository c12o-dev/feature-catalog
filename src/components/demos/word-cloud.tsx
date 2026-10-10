"use client";

const words = [
  { t: "React", w: 5 }, { t: "TypeScript", w: 4.5 }, { t: "Tailwind", w: 4 }, { t: "Next.js", w: 4 },
  { t: "Vite", w: 3 }, { t: "shadcn", w: 3.5 }, { t: "Zod", w: 2.5 }, { t: "Motion", w: 3 },
  { t: "AI", w: 4.5 }, { t: "Recharts", w: 2 }, { t: "Sonner", w: 2 }, { t: "cmdk", w: 2.5 },
  { t: "PWA", w: 2 }, { t: "RSC", w: 3 }, { t: "Edge", w: 2.5 }, { t: "Cloudflare", w: 2 },
];
// Stage chart palette, pulled 40% toward the foreground so every token clears 4.5:1 on both
// stages (the raw light chart-4/5 and dark chart-1 are too close to the background for text).
const colors = [1, 2, 3, 4, 5].map((n) => `color-mix(in oklch, var(--chart-${n}) 60%, var(--foreground))`);

export default function WordCloud() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline justify-center px-2 py-4 leading-none">
      {words.map((w, i) => (
        <span key={w.t} className="font-semibold" style={{ color: colors[i % colors.length], fontSize: `${0.65 + w.w * 0.18}rem` }}>
          {w.t}
        </span>
      ))}
    </div>
  );
}
