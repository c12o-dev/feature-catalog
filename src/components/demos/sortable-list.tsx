"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";

export default function SortableList() {
  const [items, setItems] = useState(["優先度 高", "今週", "後で", "アーカイブ"]);
  const [drag, setDrag] = useState<number | null>(null);
  const onDrop = (i: number) => {
    if (drag === null || drag === i) return;
    const copy = [...items];
    const [moved] = copy.splice(drag, 1);
    copy.splice(i, 0, moved);
    setItems(copy);
    setDrag(null);
  };
  return (
    <ul className="space-y-1 max-w-xs">
      {items.map((it, i) => (
        <li
          key={it}
          draggable
          onDragStart={() => setDrag(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(i)}
          className="flex items-center gap-2 rounded-md border bg-background px-2 py-2 text-sm cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="size-4 text-muted-foreground" />{it}
        </li>
      ))}
    </ul>
  );
}
