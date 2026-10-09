"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, FolderKanban, Plus, Search, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type Rect = { x: number; y: number; w: number; h: number; cw: number; ch: number };

const steps = [
  { id: "create", title: "プロジェクトを作成", body: "まずはここから。テンプレートも選べます。" },
  { id: "search", title: "どこからでも検索", body: "⌘K でページやメンバーをすぐ探せます。" },
  { id: "recent", title: "最近のプロジェクト", body: "直近で開いたものが上に並びます。" },
] as const;

const projects = [
  { name: "秋のキャンペーン LP", meta: "更新 2 時間前" },
  { name: "請求フロー改修", meta: "更新 昨日" },
  { name: "社内ポータル v3", meta: "更新 3 日前" },
];

export default function ProductTour() {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(true);
  const [rect, setRect] = useState<Rect | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const targets = useRef<Record<string, HTMLElement | null>>({});
  const tipRef = useRef<HTMLDivElement>(null);
  const cur = steps[step];

  useEffect(() => {
    const root = rootRef.current;
    const el = targets.current[cur.id];
    if (!root || !el || !active) return;
    const measure = () => {
      const r = root.getBoundingClientRect();
      const t = el.getBoundingClientRect();
      setRect({ x: t.left - r.left, y: t.top - r.top, w: t.width, h: t.height, cw: r.width, ch: r.height });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cur.id, active]);

  const next = () => (step < steps.length - 1 ? setStep(step + 1) : setActive(false));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const start = () => {
    setRect(null);
    setStep(0);
    setActive(true);
  };

  const pad = 6;
  const TIP_W = 216;
  const below = rect ? rect.y + rect.h + 150 < rect.ch : true;
  const tipLeft = rect ? Math.max(8, Math.min(rect.x, rect.cw - TIP_W - 8)) : 8;

  return (
    <div ref={rootRef} className="relative min-h-80 overflow-hidden rounded-lg border bg-background text-sm">
      {/* mock app */}
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-1.5 font-semibold">
          <FolderKanban className="size-4 text-primary" />
          <span className="hidden sm:inline">Tsumiki</span>
        </div>
        <div
          ref={(n) => { targets.current.search = n; }}
          className="ml-auto flex min-w-0 flex-1 items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 text-xs text-muted-foreground sm:max-w-48"
        >
          <Search className="size-3.5 shrink-0" />
          <span className="truncate">検索</span>
          <kbd className="ml-auto hidden rounded border bg-background px-1 font-mono text-[10px] sm:inline">⌘K</kbd>
        </div>
        <span ref={(n) => { targets.current.create = n; }} className="inline-flex">
          <Button size="sm" tabIndex={active ? -1 : 0} aria-label="新規作成">
            <Plus /> <span aria-hidden className="hidden sm:inline">新規作成</span>
          </Button>
        </span>
      </header>
      <div className="p-3">
        <div className="mb-2 text-xs font-medium text-muted-foreground">最近のプロジェクト</div>
        <ul className="space-y-2">
          {projects.map((p, i) => (
            <li
              key={p.name}
              ref={i === 0 ? (n) => { targets.current.recent = n; } : undefined}
              className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2"
            >
              <span className="truncate font-medium">{p.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{p.meta}</span>
            </li>
          ))}
        </ul>
      </div>

      {active && rect && (
        <>
          {/* spotlight: the giant shadow darkens everything except the cut-out */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 rounded-lg ring-2 ring-primary transition-[transform,width,height] duration-300 ease-out"
            style={{
              width: rect.w + pad * 2,
              height: rect.h + pad * 2,
              transform: `translate(${rect.x - pad}px, ${rect.y - pad}px)`,
              boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.55)",
            }}
          />
          <div
            ref={tipRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="tour-title"
            aria-describedby="tour-body"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "Escape") setActive(false);
              if (e.key === "ArrowRight") next();
              if (e.key === "ArrowLeft") prev();
            }}
            className="absolute rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg outline-none transition-[left,top] duration-300"
            style={{
              width: TIP_W,
              maxWidth: "calc(100% - 16px)",
              left: tipLeft,
              top: below ? rect.y + rect.h + pad + 10 : undefined,
              bottom: below ? undefined : rect.ch - rect.y + pad + 10,
            }}
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <div id="tour-title" className="font-semibold">{cur.title}</div>
              <button
                type="button"
                aria-label="ツアーを閉じる"
                onClick={() => setActive(false)}
                className="-m-1 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <p id="tour-body" className="mb-3 text-xs text-muted-foreground">{cur.body}</p>
            <div className="flex items-center gap-1">
              <div role="img" className="mr-auto flex gap-1" aria-label={`${step + 1} / ${steps.length}`}>
                {steps.map((s, i) => (
                  <span key={s.id} className={`h-1.5 rounded-full transition-all ${i === step ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"}`} />
                ))}
              </div>
              {step > 0 && (
                <Button size="xs" variant="ghost" onClick={prev} aria-label="前へ">
                  <ArrowLeft />
                </Button>
              )}
              <Button size="xs" onClick={next}>
                {step < steps.length - 1 ? <>次へ <ArrowRight /></> : "完了"}
              </Button>
            </div>
          </div>
        </>
      )}

      {!active && (
        <div className="absolute bottom-3 right-3">
          <Button size="sm" variant="outline" onClick={start}>
            <Play /> ツアーを再生
          </Button>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {active ? `ステップ ${step + 1} / ${steps.length}: ${cur.title}` : "ツアーを終了しました"}
      </span>
    </div>
  );
}
