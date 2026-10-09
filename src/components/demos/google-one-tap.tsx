"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function GoogleOneTap() {
  const [show, setShow] = useState(true);
  if (!show) return <button onClick={() => setShow(true)} className="text-xs text-muted-foreground">バナーを再表示</button>;
  return (
    <div className="rounded-lg border bg-background shadow-md p-3 max-w-sm relative">
      <button onClick={() => setShow(false)} className="absolute top-2 right-2 text-muted-foreground"><X className="size-3.5" /></button>
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-blue-500 grid place-items-center text-white font-medium">A</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs">alice@gmail.com としてサインイン</div>
          <div className="text-[10px] text-muted-foreground">Google アカウントで続行</div>
        </div>
      </div>
      <button className="mt-2 w-full rounded-md bg-blue-600 text-white text-xs py-1.5">続行</button>
    </div>
  );
}
