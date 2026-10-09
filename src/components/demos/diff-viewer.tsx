"use client";

const lines = [
  { type: "ctx", n: 1, t: "function add(a, b) {" },
  { type: "del", n: 2, t: "  return a + b;" },
  { type: "add", n: 2, t: "  // Validate inputs" },
  { type: "add", n: 3, t: "  if (typeof a !== 'number') throw new Error('a must be number');" },
  { type: "add", n: 4, t: "  return a + b;" },
  { type: "ctx", n: 3, t: "}" },
];

export default function DiffViewer() {
  return (
    <pre className="rounded-md border bg-background overflow-x-auto text-xs font-mono">
      {lines.map((l, i) => (
        <div
          key={i}
          className={`flex gap-3 px-3 py-0.5 ${
            l.type === "add" ? "bg-emerald-50 dark:bg-emerald-950/40" : l.type === "del" ? "bg-red-50 dark:bg-red-950/40" : ""
          }`}
        >
          <span className="text-muted-foreground w-4 text-right">{l.type === "add" ? "+" : l.type === "del" ? "−" : " "}</span>
          <span className="text-muted-foreground w-6 text-right">{l.n}</span>
          <span>{l.t}</span>
        </div>
      ))}
    </pre>
  );
}
