"use client";

import { Vibrate } from "lucide-react";
import { Button } from "@/components/ui/button";

const buzz = (pattern: number | number[]) => {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
};

export default function HapticDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button size="sm" variant="outline" onClick={() => buzz(50)}><Vibrate className="size-3.5" />Light (50ms)</Button>
      <Button size="sm" variant="outline" onClick={() => buzz(150)}><Vibrate className="size-3.5" />Medium</Button>
      <Button size="sm" variant="outline" onClick={() => buzz([50, 30, 50, 30, 50])}><Vibrate className="size-3.5" />Pattern</Button>
      <div className="text-[10px] text-muted-foreground w-full text-center">対応端末のみ振動 (Web Vibration API)</div>
    </div>
  );
}
