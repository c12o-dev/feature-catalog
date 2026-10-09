"use client";

const words = [
  { t: "React", w: 5 }, { t: "TypeScript", w: 4.5 }, { t: "Tailwind", w: 4 }, { t: "Next.js", w: 4 },
  { t: "Vite", w: 3 }, { t: "shadcn", w: 3.5 }, { t: "Zod", w: 2.5 }, { t: "Motion", w: 3 },
  { t: "AI", w: 4.5 }, { t: "Recharts", w: 2 }, { t: "Sonner", w: 2 }, { t: "cmdk", w: 2.5 },
  { t: "PWA", w: 2 }, { t: "RSC", w: 3 }, { t: "Edge", w: 2.5 }, { t: "Cloudflare", w: 2 },
];
const colors = ["text-blue-600", "text-emerald-600", "text-purple-600", "text-amber-600", "text-rose-600"];

export default function WordCloud() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline justify-center px-2 py-4 leading-none">
      {words.map((w, i) => (
        <span key={w.t} className={`font-semibold ${colors[i % colors.length]}`} style={{ fontSize: `${0.65 + w.w * 0.18}rem` }}>
          {w.t}
        </span>
      ))}
    </div>
  );
}
