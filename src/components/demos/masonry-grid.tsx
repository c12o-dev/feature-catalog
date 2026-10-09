"use client";

const items = [
  { h: 80, c: "bg-blue-300" }, { h: 120, c: "bg-emerald-300" }, { h: 60, c: "bg-rose-300" },
  { h: 100, c: "bg-amber-300" }, { h: 140, c: "bg-purple-300" }, { h: 80, c: "bg-cyan-300" },
  { h: 110, c: "bg-pink-300" }, { h: 70, c: "bg-indigo-300" }, { h: 90, c: "bg-lime-300" },
];

export default function MasonryGrid() {
  return (
    <div className="columns-3 gap-2">
      {items.map((it, i) => (
        <div key={i} className={`rounded mb-2 break-inside-avoid ${it.c}`} style={{ height: it.h }} />
      ))}
    </div>
  );
}
