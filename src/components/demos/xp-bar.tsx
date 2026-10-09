"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function XpBar() {
  const [xp, setXp] = useState(640);
  const level = Math.floor(xp / 1000) + 1;
  const inLevel = xp % 1000;
  return (
    <div className="space-y-2 max-w-md">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-medium flex items-center gap-1.5"><Sparkles className="size-4 text-amber-500" />Level {level}</div>
        <div className="text-xs text-muted-foreground tabular-nums">{inLevel} / 1000 XP</div>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${(inLevel / 1000) * 100}%` }} />
      </div>
      <Button size="sm" variant="outline" onClick={() => setXp((x) => x + 50)}>+50 XP</Button>
    </div>
  );
}
