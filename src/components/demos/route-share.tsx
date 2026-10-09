"use client";

import { useEffect, useRef, useState } from "react";
import { Bike, Car, Check, Copy, Footprints, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FROM = { name: "新宿駅", lat: 35.6896, lng: 139.7006 };
const TO = { name: "東京タワー", lat: 35.6586, lng: 139.7454 };
const modes = [
  { v: "walk", label: "徒歩", icon: Footprints, eta: "1 時間 8 分" },
  { v: "bike", label: "自転車", icon: Bike, eta: "24 分" },
  { v: "car", label: "車", icon: Car, eta: "19 分" },
] as const;

export default function RouteShare() {
  const [mode, setMode] = useState<(typeof modes)[number]["v"]>("walk");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const m = modes.find((x) => x.v === mode)!;
  const url = `https://maps.example.com/route?from=${FROM.lat},${FROM.lng}&to=${TO.lat},${TO.lng}&mode=${mode}`;

  const copy = async () => {
    let s: "copied" | "failed" = "copied";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      s = "failed";
    }
    setStatus(s);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border bg-card text-card-foreground">
      <svg viewBox="0 0 320 120" className="block h-28 w-full bg-muted/60" role="img" aria-label={`${FROM.name}から${TO.name}への経路`}>
        <g className="stroke-border" strokeWidth="6" fill="none">
          <path d="M0 40 H320 M0 92 H320 M70 0 V120 M180 0 V120 M260 0 V120" />
        </g>
        <path d="M48 30 C 110 30, 120 70, 180 70 S 250 96, 272 92" fill="none" strokeWidth="3.5" strokeLinecap="round" className="stroke-primary" strokeDasharray={mode === "walk" ? "2 6" : mode === "bike" ? "8 5" : undefined} />
        <circle cx="48" cy="30" r="6" className="fill-background stroke-primary" strokeWidth="3" />
        <circle cx="272" cy="92" r="7" className="fill-primary" />
        <text x="58" y="22" className="fill-foreground text-[10px]">{FROM.name}</text>
        <text x="262" y="112" textAnchor="end" className="fill-foreground text-[10px]">{TO.name}</text>
      </svg>
      <div className="space-y-3 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div role="radiogroup" aria-label="移動手段" className="inline-flex rounded-md bg-muted p-0.5">
            {modes.map((o) => (
              <button
                key={o.v}
                role="radio"
                aria-checked={mode === o.v}
                aria-label={o.label}
                onClick={() => setMode(o.v)}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${mode === o.v ? "bg-background font-medium shadow-sm" : "text-muted-foreground"}`}
              >
                <o.icon className="size-3.5" />
                <span className="hidden sm:inline">{o.label}</span>
              </button>
            ))}
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{m.label}で約 {m.eta}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md border bg-background p-1.5 pl-2.5">
          <Share2 className="size-3.5 shrink-0 text-muted-foreground" />
          <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url.replace("https://", "")}</code>
          <Button size="sm" variant="outline" onClick={copy} aria-label="経路リンクをコピー">
            {status === "copied" ? <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-3.5" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">出発地・目的地の座標と移動手段が URL に入るので、開いた人にも同じ経路が表示されます</p>
        <p aria-live="polite" className={`text-xs ${status === "failed" ? "text-destructive" : "sr-only"}`}>
          {status === "copied" ? "リンクをコピーしました" : status === "failed" ? "コピーできませんでした。URL を選択してコピーしてください" : ""}
        </p>
      </div>
    </div>
  );
}
