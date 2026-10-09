"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Undo2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStage } from "@/components/stage/stage-context";

const W = 800;
const H = 280;
type Pt = { x: number; y: number };

export default function SignaturePad() {
  const ref = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Pt[][]>([]);
  const activeId = useRef<number | null>(null);
  const [count, setCount] = useState(0);
  const [signed, setSigned] = useState(false);
  const theme = useStage()?.theme;

  const redraw = () => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = getComputedStyle(c).color;
    for (const s of strokes.current) {
      if (s.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      if (s.length === 1) ctx.lineTo(s[0].x + 0.1, s[0].y);
      for (let i = 1; i < s.length; i++) {
        const p = s[i - 1];
        const q = s[i];
        ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
      }
      ctx.stroke();
    }
  };

  // Stage theme flips change the ink colour; repaint existing strokes.
  useEffect(() => {
    const id = requestAnimationFrame(redraw);
    return () => cancelAnimationFrame(id);
  }, [theme]);

  const toCanvas = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (signed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    activeId.current = e.pointerId;
    strokes.current.push([toCanvas(e)]);
    redraw();
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeId.current !== e.pointerId) return;
    strokes.current[strokes.current.length - 1].push(toCanvas(e));
    redraw();
  };
  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeId.current !== e.pointerId) return;
    activeId.current = null;
    setCount(strokes.current.length);
  };

  const undo = () => {
    strokes.current.pop();
    setCount(strokes.current.length);
    redraw();
  };
  const clear = () => {
    strokes.current = [];
    setCount(0);
    setSigned(false);
    redraw();
  };

  const empty = count === 0;

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">署名</span>
        <span className="text-xs text-muted-foreground">業務委託契約書 · 2026/10/01</span>
      </div>
      <div className="relative">
        <canvas
          ref={ref}
          width={W}
          height={H}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-label="署名欄。マウス・指・ペンで署名してください"
          role="img"
          className={`block aspect-[800/280] w-full touch-none rounded-lg border bg-background text-foreground ${
            signed ? "cursor-default" : "cursor-crosshair"
          }`}
        />
        <div className="pointer-events-none absolute inset-x-6 bottom-8 flex items-end gap-2 border-b border-dashed border-muted-foreground/40 pb-1">
          <span className="text-xs text-muted-foreground">×</span>
        </div>
        {empty && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            ここに署名してください
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {signed ? "署名を確定しました" : empty ? "未署名" : `${count} 画`}
        </span>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={undo} disabled={empty || signed}>
            <Undo2 />
            戻す
          </Button>
          <Button size="sm" variant="ghost" onClick={clear} disabled={empty}>
            <Eraser />
            クリア
          </Button>
          <Button size="sm" onClick={() => setSigned(true)} disabled={empty || signed}>
            <Check />
            確定
          </Button>
        </div>
      </div>
    </div>
  );
}
