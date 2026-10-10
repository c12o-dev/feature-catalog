"use client";

// Stage chart tokens; the label colour is picked per token and stage for ≥ 4.5:1.
const colors = [
  "bg-chart-1 text-black",
  "bg-chart-2 text-black",
  "bg-chart-3 text-white dark:text-black",
  "bg-chart-4 text-black",
];

export default function SnapScroll() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">スクロールが各セクションに吸着</div>
      <div tabIndex={0} role="region" aria-label="スナップスクロールのセクション" className="focus-visible:outline-2 focus-visible:outline-ring flex gap-2 overflow-x-auto snap-x snap-mandatory rounded-md border h-32 p-2">
        {colors.map((c, i) => (
          <div key={i} className={`shrink-0 w-3/4 rounded ${c} grid place-items-center font-semibold snap-center`}>Section {i + 1}</div>
        ))}
      </div>
    </div>
  );
}
