"use client";

const cards = [
  { title: "Tailwind v4 がやってきた", time: "5 分前", who: "Alice", img: "from-blue-300 to-cyan-300" },
  { title: "shadcn base-nova の使い方", time: "1 時間前", who: "Bob", img: "from-emerald-300 to-lime-300" },
  { title: "Next.js 16 RSC 完全ガイド", time: "3 時間前", who: "Carol", img: "from-purple-300 to-pink-300" },
];

export default function CardFeed() {
  return (
    <div className="space-y-3">
      {cards.map((c, i) => (
        <article key={i} className="rounded-md border bg-background overflow-hidden">
          <div className={`h-20 bg-gradient-to-br ${c.img}`} />
          <div className="p-3 space-y-1">
            <div className="font-medium text-sm">{c.title}</div>
            <div className="text-xs text-muted-foreground">{c.who} · {c.time}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
