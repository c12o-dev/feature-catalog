"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReplayTour() {
  return (
    <div className="text-center">
      <Button size="sm" variant="outline"><Play className="size-3.5" />ツアーを再生</Button>
      <div className="text-xs text-muted-foreground mt-1">機能ツアーをもう一度見る</div>
    </div>
  );
}
