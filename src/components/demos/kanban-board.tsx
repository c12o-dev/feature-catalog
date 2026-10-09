"use client";

import { useState } from "react";

type Card = { id: number; title: string };
type Cols = { [key: string]: Card[] };

const initial: Cols = {
  Todo: [{ id: 1, title: "デザイン Review" }, { id: 2, title: "API スキーマ" }],
  Doing: [{ id: 3, title: "ヘッダー実装" }],
  Done: [{ id: 4, title: "リポジトリ init" }, { id: 5, title: "Tailwind 設定" }],
};

export default function KanbanBoard() {
  const [cols, setCols] = useState(initial);
  const [drag, setDrag] = useState<{ from: string; id: number } | null>(null);
  const move = (to: string) => {
    if (!drag) return;
    setCols((c) => {
      const card = c[drag.from].find((x) => x.id === drag.id)!;
      return {
        ...c,
        [drag.from]: c[drag.from].filter((x) => x.id !== drag.id),
        [to]: [...c[to], card],
      };
    });
    setDrag(null);
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(cols).map(([name, list]) => (
        <div
          key={name}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => move(name)}
          className="rounded-md border bg-muted/30 p-2 min-h-[10rem]"
        >
          <div className="text-xs font-medium mb-2 flex items-center justify-between">
            <span>{name}</span>
            <span className="text-muted-foreground tabular-nums">{list.length}</span>
          </div>
          <div className="space-y-1.5">
            {list.map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDrag({ from: name, id: c.id })}
                className="rounded border bg-background p-2 text-xs cursor-grab active:cursor-grabbing"
              >
                {c.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
