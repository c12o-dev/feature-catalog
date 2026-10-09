"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

const steps = [
  { x: "10%", y: "20%", title: "ヒーロー", body: "サイトの第一印象を決める領域" },
  { x: "70%", y: "20%", title: "ナビ", body: "主要機能への入り口" },
  { x: "10%", y: "70%", title: "コンテンツ", body: "本体のリスト表示" },
];

export default function ProductTour() {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(true);
  if (!active) return <div className="text-center"><Button onClick={() => { setStep(0); setActive(true); }}>ツアー再開</Button></div>;
  const cur = steps[step];

  return (
    <div className="relative h-48 rounded-md border bg-background overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2 text-xs text-muted-foreground">
        <div className="bg-muted/30 rounded grid place-items-center">Hero</div>
        <div className="bg-muted/30 rounded grid place-items-center">Nav</div>
        <div className="bg-muted/30 rounded col-span-2 grid place-items-center">Content</div>
      </div>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute rounded-lg border-2 border-primary bg-background/0 size-20" style={{ left: cur.x, top: cur.y }} />
      <div className="absolute rounded-md border bg-popover p-3 text-xs shadow-lg max-w-[10rem]" style={{ left: `calc(${cur.x} + 6rem)`, top: cur.y }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="font-semibold">{cur.title}</div>
          <button onClick={() => setActive(false)}><X className="size-3" /></button>
        </div>
        <div className="text-muted-foreground mb-2">{cur.body}</div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground">{step + 1}/{steps.length}</div>
          <Button size="xs" onClick={() => step < steps.length - 1 ? setStep(step + 1) : setActive(false)}>
            {step < steps.length - 1 ? <>次へ <ArrowRight className="size-3" /></> : "完了"}
          </Button>
        </div>
      </div>
    </div>
  );
}
