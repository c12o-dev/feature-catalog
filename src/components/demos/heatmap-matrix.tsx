"use client";

const labels = ["A", "B", "C", "D", "E", "F"];
const matrix = labels.map((_, i) => labels.map((_, j) => (i === j ? 1 : Math.round((Math.cos(i + j * 1.7) + 1) * 50) / 100)));

export default function HeatmapMatrix() {
  return (
    <div className="inline-block">
      <div className="grid" style={{ gridTemplateColumns: `auto repeat(${labels.length}, 1fr)` }}>
        <div />
        {labels.map((l) => <div key={l} className="text-xs text-center text-muted-foreground p-1">{l}</div>)}
        {matrix.map((row, i) => (
          <div key={i} className="contents">
            <div className="text-xs text-right text-muted-foreground pr-2 self-center">{labels[i]}</div>
            {row.map((v, j) => (
              <div
                key={j}
                className={`size-9 grid place-items-center text-[10px] m-0.5 rounded [--cell-l:60%] dark:[--cell-l:45%] ${v > 0.5 ? "text-zinc-950 dark:text-white" : ""}`}
                style={{ background: `hsl(217 91% var(--cell-l) / ${v})` }}
              >
                {v.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
