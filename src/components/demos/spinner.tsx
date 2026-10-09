"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Ring({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} motion-safe:animate-spin`} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" strokeWidth="3" className="stroke-muted" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-primary" />
    </svg>
  );
}

function Dots() {
  return (
    <span className="flex gap-1" aria-hidden>
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="size-2 rounded-full bg-primary motion-safe:animate-bounce motion-reduce:opacity-60"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}

const VARIANTS = [
  { label: "インライン", node: <Loader2 className="size-4 text-muted-foreground motion-safe:animate-spin" aria-hidden /> },
  { label: "リング", node: <Ring /> },
  { label: "ドット", node: <Dots /> },
];

export default function Spinner() {
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const save = () => {
    setSaving(true);
    timer.current = setTimeout(() => setSaving(false), 1800);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {VARIANTS.map((v) => (
          <div key={v.label} role="status" className="flex flex-col items-center gap-2 rounded-lg border bg-card px-2 py-4">
            <span className="grid h-6 place-items-center">{v.node}</span>
            <span className="text-xs text-muted-foreground">{v.label}</span>
            <span className="sr-only">読み込み中</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">下書きを保存</p>
          <p className="text-xs text-muted-foreground">ボタン内スピナーの例</p>
        </div>
        <Button size="sm" onClick={save} disabled={saving} aria-busy={saving} className="min-w-24">
          {saving ? (
            <>
              <Loader2 className="motion-safe:animate-spin" aria-hidden />
              保存中
            </>
          ) : (
            "保存する"
          )}
        </Button>
        <span role="status" className="sr-only">
          {saving ? "保存中" : ""}
        </span>
      </div>
      <p className="text-center text-[11px] text-muted-foreground motion-safe:hidden">
        視差効果を減らす設定のため、回転を止めて表示しています
      </p>
    </div>
  );
}
