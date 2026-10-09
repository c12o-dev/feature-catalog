"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const photos = [
  { title: "朝の海岸", bg: "linear-gradient(160deg,#fbd38d 0%,#f6ad55 35%,#4a90b8 70%,#1e4e6e 100%)" },
  { title: "森の小道", bg: "linear-gradient(170deg,#c6f6d5 0%,#68a37a 45%,#2f5d43 100%)" },
  { title: "夕暮れの街", bg: "linear-gradient(180deg,#f9a8a8 0%,#b07cc6 45%,#2d2a4a 100%)" },
  { title: "雪山", bg: "linear-gradient(175deg,#e6eef7 0%,#a7bccf 50%,#4b5d73 100%)" },
  { title: "砂丘", bg: "linear-gradient(165deg,#fde7c4 0%,#e0b07a 50%,#9b6b3d 100%)" },
  { title: "夜の湖", bg: "linear-gradient(180deg,#1a2340 0%,#2b3d6b 50%,#0d1426 100%)" },
];

export default function Lightbox() {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastIndex = useRef(0);

  const close = () => {
    const i = open ?? lastIndex.current;
    setOpen(null);
    thumbRefs.current[i]?.focus();
  };
  const step = (d: number) => setOpen((o) => (o === null ? o : (o + d + photos.length) % photos.length));

  const isOpen = open !== null;
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        thumbRefs.current[open]?.focus();
      } else if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % photos.length));
      else if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + photos.length) % photos.length));
      else if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative min-h-[320px] rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium">旅のアルバム</span>
        <span className="text-xs text-muted-foreground">{photos.length} 枚</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((p, i) => (
          <button
            key={p.title}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => {
              lastIndex.current = i;
              setOpen(i);
            }}
            aria-label={`${p.title} を拡大表示`}
            className="aspect-square rounded-md transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{ background: p.bg }}
          />
        ))}
      </div>

      {open !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${photos[open].title}（${open + 1} / ${photos.length}）`}
          className="absolute inset-0 z-20 flex flex-col rounded-lg bg-black/90 p-3 text-white"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs tabular-nums text-white/70" aria-live="polite">
              {photos[open].title} · {open + 1} / {photos.length}
            </span>
            <button ref={closeRef} type="button" onClick={close} aria-label="閉じる" className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <X className="size-4" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center py-3" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="aspect-[4/3] max-h-full w-full max-w-md rounded-md shadow-2xl" style={{ background: photos[open].bg }} />
            <button type="button" onClick={() => step(-1)} aria-label="前の写真" className="absolute left-0 grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="次の写真" className="absolute right-0 grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <ChevronRight className="size-5" />
            </button>
          </div>
          <p className="text-center text-xs text-white/60">← → で移動 · Esc で閉じる</p>
        </div>
      )}
    </div>
  );
}
