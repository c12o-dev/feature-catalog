"use client";

import { useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Coachmark() {
  const [show, setShow] = useState(true);
  return (
    <div className="flex items-center justify-center h-32 relative">
      <Button variant="outline">機能ボタン</Button>
      {show && (
        <div className="absolute top-1/2 left-[58%] mt-2 max-w-[12rem] rounded-md border bg-popover p-2 text-xs shadow-md">
          <div className="flex items-start gap-2">
            <Lightbulb className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium mb-0.5">新機能</div>
              <div className="text-muted-foreground">クリックすると詳細が見られます</div>
            </div>
            <button onClick={() => setShow(false)}><X className="size-3" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
