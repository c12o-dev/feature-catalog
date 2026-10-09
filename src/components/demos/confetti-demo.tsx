"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "motion/react";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfettiDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireRef = useRef<confetti.CreateTypes | null>(null);
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fire = confetti.create(canvas, { resize: true, disableForReducedMotion: true });
    fireRef.current = fire;
    return () => {
      fire.reset();
      fireRef.current = null;
    };
  }, []);

  const burst = () => {
    setDone(true);
    if (reduce) return;
    fireRef.current?.({
      particleCount: 90,
      spread: 75,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.75 },
      disableForReducedMotion: true,
    });
  };

  return (
    <div className="relative flex min-h-56 flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border bg-card p-6 text-center">
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      <div className="relative space-y-1" aria-live="polite">
        <p className="text-sm font-medium">{done ? "オンボーディング完了！" : "残り 1 ステップ"}</p>
        <p className="text-xs text-muted-foreground">
          {done ? "すべての設定が終わりました。" : "最後のタスクを完了すると演出が出ます。"}
        </p>
      </div>
      <Button onClick={burst} className="relative">
        <PartyPopper className="size-4" aria-hidden />
        {done ? "もう一度お祝い" : "完了にする"}
      </Button>
    </div>
  );
}
