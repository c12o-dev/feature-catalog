"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function SignaturePad() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [empty, setEmpty] = useState(true);

  const draw = (e: React.PointerEvent) => {
    if (!drawing) return;
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "currentColor";
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
    ctx.stroke();
    setEmpty(false);
  };
  const start = (e: React.PointerEvent) => {
    setDrawing(true);
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
  };
  const clear = () => { ref.current!.getContext("2d")!.clearRect(0, 0, 999, 999); setEmpty(true); };

  return (
    <div className="space-y-2 max-w-md">
      <canvas
        ref={ref}
        width={400}
        height={140}
        onPointerDown={start}
        onPointerUp={() => setDrawing(false)}
        onPointerMove={draw}
        onPointerLeave={() => setDrawing(false)}
        className="rounded-md border bg-background w-full touch-none cursor-crosshair text-foreground"
      />
      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">{empty ? "ここに署名" : "署名されました"}</span>
        <Button size="sm" variant="ghost" onClick={clear}>クリア</Button>
      </div>
    </div>
  );
}
