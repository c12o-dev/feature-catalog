"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, CircleHelp, Play, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "new", title: "新規作成", body: "ここからドキュメントやタスクを作成できます。", align: "right" },
  { id: "search", title: "検索", body: "全ドキュメントをキーワードで横断検索します。", align: "left" },
  { id: "list", title: "最近の項目", body: "直近に開いた項目がここに並びます。", align: "left" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function ReplayTour() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  // step: index into STEPS, single: show only one tooltip (replay a single hint)
  const [tour, setTour] = useState<{ step: number; single: boolean } | null>(null);
  const [done, setDone] = useState("");
  const tipRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tour) tipRef.current?.focus();
  }, [tour]);

  useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && !tour) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setTour(null);
      helpRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, tour]);

  const start = (step: number, single: boolean) => {
    setMenuOpen(false);
    setSubOpen(false);
    setDone("");
    setTour({ step, single });
  };

  const finish = (msg: string) => {
    setTour(null);
    setDone(msg);
    helpRef.current?.focus();
  };

  const active: StepId | null = tour ? STEPS[tour.step].id : null;

  const tip = (id: StepId) => {
    if (!tour || active !== id) return null;
    const s = STEPS[tour.step];
    const last = tour.single || tour.step === STEPS.length - 1;
    return (
      <div
        ref={tipRef}
        tabIndex={-1}
        role="dialog"
        aria-label={`ツアー: ${s.title}`}
        className={cn(
          "absolute top-full z-30 mt-2 w-56 rounded-lg border bg-popover p-3 text-left text-popover-foreground shadow-lg outline-none",
          s.align === "right" ? "right-0" : "left-0",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-medium">{s.title}</div>
          <button
            type="button"
            aria-label="ツアーを閉じる"
            onClick={() => finish("ツアーを閉じました")}
            className="-m-1 rounded p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-3.5" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground tabular-nums">
            {tour.single ? "ヒント" : `${tour.step + 1} / ${STEPS.length}`}
          </span>
          <div className="flex gap-1">
            {!tour.single && tour.step > 0 && (
              <button
                type="button"
                onClick={() => setTour({ ...tour, step: tour.step - 1 })}
                className="rounded-md px-2 py-1 text-xs hover:bg-muted"
              >
                戻る
              </button>
            )}
            <button
              type="button"
              onClick={() => (last ? finish("ツアーが完了しました") : setTour({ ...tour, step: tour.step + 1 }))}
              className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
            >
              {last ? "完了" : "次へ"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const hl = (id: StepId) => (active === id ? "relative z-20 ring-2 ring-primary ring-offset-2 ring-offset-background" : "");

  return (
    <div className="relative mx-auto min-h-[320px] w-full max-w-lg overflow-hidden rounded-lg border bg-background">
      {tour && <div aria-hidden className="absolute inset-0 z-10 bg-black/40" onClick={() => finish("ツアーを閉じました")} />}

      <header className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <span className="truncate text-sm font-semibold">Hikari Notes</span>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              className={cn("flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground", hl("new"))}
            >
              <Plus className="size-3.5" aria-hidden />
              新規
            </button>
            {tip("new")}
          </div>
          <div className="relative">
            <button
              ref={helpRef}
              type="button"
              aria-label="ヘルプ"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <CircleHelp className="size-4" />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                role="menu"
                aria-label="ヘルプ"
                className="absolute right-0 top-full z-30 mt-1 w-56 rounded-lg border bg-popover p-1 text-sm text-popover-foreground shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => start(0, false)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                >
                  <Play className="size-3.5" aria-hidden />
                  ツアーを最初から再生
                </button>
                <button
                  type="button"
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={subOpen}
                  onClick={() => setSubOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                >
                  ヒントを個別に再表示
                  <ChevronRight className={cn("size-3.5 transition-transform", subOpen && "rotate-90")} aria-hidden />
                </button>
                {subOpen && (
                  <div role="menu" aria-label="ヒント" className="ml-3 border-l pl-1">
                    {STEPS.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        role="menuitem"
                        onClick={() => start(i, true)}
                        className="block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-3 p-3">
        <div className="relative">
          <div className={cn("flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs text-muted-foreground", hl("search"))}>
            <Search className="size-3.5" aria-hidden />
            ドキュメントを検索
          </div>
          {tip("search")}
        </div>
        <div className="relative">
          <ul className={cn("divide-y rounded-md border bg-background text-sm", hl("list"))}>
            {["週次定例メモ", "Q4 ロードマップ", "採用面談の質問集"].map((t, i) => (
              <li key={t} className="flex items-center justify-between gap-2 px-2.5 py-2">
                <span className="truncate">{t}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{["今日", "昨日", "3日前"][i]}</span>
              </li>
            ))}
          </ul>
          {tip("list")}
        </div>
        <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
          {done || (!tour && "右上の ? から「ツアーを最初から再生」を選べます")}
        </p>
      </div>
    </div>
  );
}
