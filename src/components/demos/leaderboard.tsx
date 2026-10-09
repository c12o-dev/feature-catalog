"use client";

const ranks = [
  { rank: 1, name: "alice", score: 12840, color: "bg-amber-400" },
  { rank: 2, name: "bob", score: 11240, color: "bg-zinc-400" },
  { rank: 3, name: "carol", score: 9820, color: "bg-orange-400" },
  { rank: 4, name: "dan", score: 8240, me: true },
  { rank: 5, name: "eve", score: 7100 },
];

export default function Leaderboard() {
  return (
    <ol className="space-y-1 max-w-sm">
      {ranks.map((r) => (
        <li key={r.name} className={`flex items-center gap-3 rounded-md border bg-background p-2 ${r.me ? "border-primary ring-1 ring-primary/30" : ""}`}>
          <div className={`size-8 rounded-full grid place-items-center text-white font-semibold tabular-nums ${r.color ?? "bg-muted text-muted-foreground"}`}>
            {r.rank}
          </div>
          <div className="flex-1 text-sm">{r.name}{r.me && <span className="ml-1 text-xs text-primary">(あなた)</span>}</div>
          <div className="text-sm font-mono tabular-nums">{r.score.toLocaleString()}</div>
        </li>
      ))}
    </ol>
  );
}
