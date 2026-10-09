"use client";

const trending = [
  { tag: "#TypeScript", count: "12.4k posts" },
  { tag: "#shadcn", count: "8.2k" },
  { tag: "#React19", count: "5.1k" },
  { tag: "#TailwindV4", count: "3.8k" },
];

export default function HashtagChip() {
  return (
    <div className="space-y-2 max-w-sm">
      <div className="text-xs text-muted-foreground">Trending</div>
      <ul className="space-y-1">
        {trending.map((t) => (
          <li key={t.tag} className="flex items-center justify-between rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent cursor-pointer">
            <span className="text-blue-600 font-medium">{t.tag}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{t.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
