"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const rewards = ["100 G", "500 G", "1000 G", "★3 装備", "★4 装備", "★5 装備 (jackpot!)"];
const probs = [0.4, 0.3, 0.15, 0.1, 0.04, 0.01];

export default function Gacha() {
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const draw = () => {
    setSpinning(true);
    setTimeout(() => {
      const r = Math.random();
      let acc = 0;
      for (let i = 0; i < probs.length; i++) {
        acc += probs[i];
        if (r < acc) { setResult(rewards[i]); break; }
      }
      setSpinning(false);
    }, 800);
  };
  return (
    <div className="text-center space-y-3">
      <div className="size-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 grid place-items-center text-white">
        <Gift className={`size-12 ${spinning ? "animate-spin" : ""}`} />
      </div>
      <Button onClick={draw} disabled={spinning} size="lg">{spinning ? "ガチャ中..." : "回す (100 G)"}</Button>
      {result && !spinning && <div className="text-base font-semibold">🎉 {result}</div>}
    </div>
  );
}
