"use client";

const chapters = [
  { t: 0, label: "Intro", pct: 0 },
  { t: 90, label: "Setup", pct: 25 },
  { t: 180, label: "Demo", pct: 50 },
  { t: 270, label: "QA", pct: 75 },
  { t: 350, label: "End", pct: 92 },
];

export default function ChapterMarkers() {
  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full bg-muted">
        <div className="absolute inset-y-0 left-0 bg-red-500 rounded-full" style={{ width: "40%" }} />
        {chapters.map((c) => (
          <div key={c.label} className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-background border-2 border-red-500" style={{ left: `${c.pct}%`, transform: "translate(-50%, -50%)" }} />
        ))}
      </div>
      <ul className="space-y-1">
        {chapters.map((c) => (
          <li key={c.label} className="text-xs flex items-center gap-2">
            <span className="font-mono tabular-nums text-muted-foreground w-10">{Math.floor(c.t / 60)}:{(c.t % 60).toString().padStart(2, "0")}</span>
            <span>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
