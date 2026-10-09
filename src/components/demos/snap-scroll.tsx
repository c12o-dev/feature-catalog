"use client";

const colors = ["bg-blue-700", "bg-emerald-700", "bg-amber-700", "bg-rose-700"];

export default function SnapScroll() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">スクロールが各セクションに吸着</div>
      <div tabIndex={0} role="region" aria-label="スナップスクロールのセクション" className="focus-visible:outline-2 focus-visible:outline-ring flex gap-2 overflow-x-auto snap-x snap-mandatory rounded-md border h-32 p-2">
        {colors.map((c, i) => (
          <div key={i} className={`shrink-0 w-3/4 rounded ${c} grid place-items-center text-white font-semibold snap-center`}>Section {i + 1}</div>
        ))}
      </div>
    </div>
  );
}
