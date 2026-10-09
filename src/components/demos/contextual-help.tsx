"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function HelpTip({ label, children }: { label: string; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [focus, setFocus] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const open = hover || pinned || focus;

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setPinned(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setPinned(false); setFocus(false); } };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [pinned]);

  return (
    <span ref={ref} className="inline-flex" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        type="button"
        aria-label={`${label} のヘルプ`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setPinned((p) => !p)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={(e) => { if (e.key === "Escape") { setPinned(false); setFocus(false); } }}
        className="grid size-5 place-items-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HelpCircle className="size-3.5" aria-hidden />
      </button>
      {open && (
        <span id={id} role="tooltip" className="absolute top-6 left-0 z-10 block w-full max-w-72 rounded-md border bg-popover p-2.5 text-left text-xs text-popover-foreground shadow-md">
          {children}
        </span>
      )}
    </span>
  );
}

export default function ContextualHelp() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-4 pb-20">
      <div className="relative space-y-1.5">
        <div className="flex items-center gap-1">
          <Label htmlFor="ch-url" className="text-xs">API ベース URL</Label>
          <HelpTip label="API ベース URL">
            <span className="mb-0.5 block font-medium">リクエスト先の URL</span>
            <span className="block text-muted-foreground">本番は https://api.example.com、検証は sandbox. で始まる URL を指定します。</span>
          </HelpTip>
        </div>
        <Input id="ch-url" placeholder="https://api.example.com" />
      </div>
      <div className="relative space-y-1.5">
        <div className="flex items-center gap-1">
          <Label htmlFor="ch-timeout" className="text-xs">タイムアウト (秒)</Label>
          <HelpTip label="タイムアウト">
            <span className="mb-0.5 block font-medium">応答待ちの上限</span>
            <span className="block text-muted-foreground">超えるとリトライします。通常は 30 秒で十分です。</span>
          </HelpTip>
        </div>
        <Input id="ch-timeout" inputMode="numeric" defaultValue="30" />
      </div>
    </div>
  );
}
