"use client";

import { useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

export default function ConfettiDemo() {
  const ref = useRef<HTMLButtonElement>(null);

  const burst = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
    });
  };

  return (
    <div className="text-center">
      <Button ref={ref} onClick={burst} size="lg">
        <PartyPopper className="size-4" />
        Celebrate!
      </Button>
    </div>
  );
}
