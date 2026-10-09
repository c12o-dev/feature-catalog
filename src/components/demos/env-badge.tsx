"use client";

const envs = [
  { name: "production", color: "bg-emerald-700" },
  { name: "staging", color: "bg-amber-700" },
  { name: "preview", color: "bg-blue-700" },
  { name: "development", color: "bg-zinc-600" },
];

export default function EnvBadge() {
  return (
    <div className="space-y-2">
      {envs.map((e) => (
        <div key={e.name} className="rounded-md border bg-background overflow-hidden">
          <div className={`${e.color} text-white px-3 py-1 text-xs font-mono uppercase tracking-wider`}>
            {e.name}
          </div>
          <div className="p-3 text-xs text-muted-foreground">
            example.com アプリの上部 banner
          </div>
        </div>
      ))}
    </div>
  );
}
