"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SUGGESTIONS = ["夜明けの湖と山、水彩", "夕焼けの砂丘", "霧の森と月"];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Art({ seed }: { seed: number }) {
  const r = mulberry32(seed);
  const hue = Math.floor(r() * 360);
  const sky1 = `hsl(${hue} 70% 78%)`;
  const sky2 = `hsl(${(hue + 40) % 360} 75% 88%)`;
  const m1 = `hsl(${(hue + 200) % 360} 25% 45%)`;
  const m2 = `hsl(${(hue + 210) % 360} 30% 30%)`;
  const sunX = 20 + r() * 60;
  const sunY = 20 + r() * 20;
  const peaks = (base: number, amp: number) => {
    let d = `M0 100 L0 ${base}`;
    for (let x = 0; x <= 100; x += 10) d += ` L${x} ${base - r() * amp}`;
    return d + " L100 100 Z";
  };
  const gid = `g${seed}`;
  return (
    <svg viewBox="0 0 100 100" className="block size-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky1} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${gid})`} />
      <circle cx={sunX} cy={sunY} r={8 + r() * 6} fill="#fff" opacity={0.75} />
      <path d={peaks(70, 30)} fill={m1} opacity={0.75} />
      <path d={peaks(85, 18)} fill={m2} />
      <rect y="88" width="100" height="12" fill={sky1} opacity={0.35} />
    </svg>
  );
}

export default function AiImage() {
  const inputId = useId();
  const [prompt, setPrompt] = useState(SUGGESTIONS[0]);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<{ prompt: string; seed: number } | null>(null);
  const [selected, setSelected] = useState(0);
  const [inserted, setInserted] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const run = () => {
    const p = prompt.trim();
    if (!p || state === "loading") return;
    setState("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setResult({ prompt: p, seed: hash(p) });
      setSelected(0);
      setInserted(null);
      setState("done");
    }, 1600);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
          プロンプト
        </label>
        <div className="flex gap-2">
          <Input
            id={inputId}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                run();
              }
            }}
            placeholder="描きたいものを入力"
          />
          <Button onClick={run} disabled={state === "loading" || !prompt.trim()}>
            {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            生成
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPrompt(s)}
              className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2" aria-busy={state === "loading"}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
            {state === "loading" ? (
              <div className="grid size-full animate-pulse place-items-center text-xs text-muted-foreground">生成中…</div>
            ) : result ? (
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`候補 ${i + 1} を選択`}
                aria-pressed={selected === i}
                className={cn("block size-full", selected === i && "ring-2 ring-primary ring-inset")}
              >
                <Art seed={result.seed + i * 7919} />
              </button>
            ) : (
              <div className="grid size-full place-items-center border-dashed text-xs text-muted-foreground">候補 {i + 1}</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs text-muted-foreground" aria-live="polite">
          {state === "loading" ? "画像を生成しています…" : inserted !== null ? `候補 ${inserted + 1} をドキュメントに挿入しました` : result ? `「${result.prompt}」から 4 枚生成しました` : "Enter または「生成」で作成"}
        </p>
        {state === "done" && (
          <Button size="sm" variant="outline" onClick={() => setInserted(selected)}>
            <ImagePlus className="size-3.5" />
            候補 {selected + 1} を挿入
          </Button>
        )}
      </div>
    </div>
  );
}
