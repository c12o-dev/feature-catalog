"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = ["カート", "配送先", "支払い", "確認"];

export default function WizardSteps() {
  const [s, setS] = useState(1);
  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center gap-1">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 flex items-center gap-1">
            <div className={`flex flex-col items-center text-center text-[10px] ${i <= s ? "text-foreground" : "text-muted-foreground"}`}>
              <div className={`size-7 rounded-full grid place-items-center text-xs font-medium ${i < s ? "bg-emerald-500 text-white" : i === s ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {i < s ? <Check className="size-3.5" /> : i + 1}
              </div>
              <div className="mt-1">{label}</div>
            </div>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${i < s ? "bg-emerald-500" : "bg-muted"}`} />}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button size="sm" variant="outline" onClick={() => setS((s) => Math.max(0, s - 1))} disabled={s === 0}>戻る</Button>
        <Button size="sm" onClick={() => setS((s) => Math.min(steps.length - 1, s + 1))} disabled={s === steps.length - 1}>次へ</Button>
      </div>
    </div>
  );
}
