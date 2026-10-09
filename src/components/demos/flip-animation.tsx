"use client";

import { useState } from "react";
import { motion, Reorder } from "motion/react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

export default function FlipAnimation() {
  const [items, setItems] = useState(["A", "B", "C", "D", "E"]);
  const shuffle = () => setItems((it) => [...it].sort(() => Math.random() - 0.5));
  return (
    <div className="space-y-2 max-w-sm">
      <Button size="sm" onClick={shuffle}><Shuffle className="size-3.5" />シャッフル</Button>
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-1">
        {items.map((it) => (
          <Reorder.Item key={it} value={it} className="rounded-md border bg-background p-2 cursor-grab text-sm">
            <motion.div layout>{it}</motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
