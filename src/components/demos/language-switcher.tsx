"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Lang = {
  code: string;
  label: string;
  native: string;
  copy: { title: string; body: string; cta: string; date: string; price: string };
};

const LANGS: Lang[] = [
  {
    code: "ja",
    label: "日本語",
    native: "Japanese",
    copy: { title: "ようこそ、ひよりさん", body: "今週のレポートが届きました。3 件のタスクが期限間近です。", cta: "レポートを見る", date: "2026年10月1日", price: "¥12,800" },
  },
  {
    code: "en",
    label: "English",
    native: "英語",
    copy: { title: "Welcome back, Hiyori", body: "Your weekly report is ready. 3 tasks are due soon.", cta: "View report", date: "October 1, 2026", price: "¥12,800" },
  },
  {
    code: "zh-Hans",
    label: "简体中文",
    native: "中国語（簡体）",
    copy: { title: "欢迎回来，日和", body: "本周报告已生成，有 3 项任务即将到期。", cta: "查看报告", date: "2026年10月1日", price: "¥12,800" },
  },
  {
    code: "ko",
    label: "한국어",
    native: "韓国語",
    copy: { title: "다시 오신 것을 환영해요, 히요리 님", body: "이번 주 리포트가 도착했어요. 마감이 임박한 작업이 3개 있어요.", cta: "리포트 보기", date: "2026년 10월 1일", price: "¥12,800" },
  },
  {
    code: "es",
    label: "Español",
    native: "スペイン語",
    copy: { title: "Hola de nuevo, Hiyori", body: "Tu informe semanal está listo. Tienes 3 tareas a punto de vencer.", cta: "Ver informe", date: "1 de octubre de 2026", price: "12.800 ¥" },
  },
];

export default function LanguageSwitcher() {
  const [code, setCode] = useState("ja");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const cur = LANGS.find((l) => l.code === code) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, LANGS.findIndex((l) => l.code === code)));
    setOpen(true);
  };
  const choose = (i: number) => {
    setCode(LANGS[i].code);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % LANGS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + LANGS.length) % LANGS.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(LANGS.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Escape") e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground" id={`${id}-label`}>
          表示言語
        </span>
        <div ref={wrapRef} className="relative">
          <button
            ref={btnRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-labelledby={`${id}-label ${id}-btn`}
            id={`${id}-btn`}
            onClick={() => (open ? setOpen(false) : openList())}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                openList();
              }
            }}
            className="flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm shadow-xs hover:bg-muted"
          >
            <Globe aria-hidden className="size-4 text-muted-foreground" />
            <span lang={cur.code}>{cur.label}</span>
            <ChevronDown aria-hidden className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={`${id}-label`}
              aria-activedescendant={`${id}-opt-${active}`}
              onKeyDown={onListKey}
              className="absolute right-0 top-full z-10 mt-1 w-48 max-w-[calc(100vw-2rem)] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95"
            >
              {LANGS.map((l, i) => (
                <li
                  key={l.code}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={l.code === code}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex cursor-default items-center gap-2 rounded px-2 py-1.5 text-sm",
                    i === active && "bg-muted",
                  )}
                >
                  <span lang={l.code} className="flex-1">
                    {l.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{l.native}</span>
                  <Check aria-hidden className={cn("size-3.5", l.code === code ? "opacity-100" : "opacity-0")} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <article lang={cur.code} aria-live="polite" className="rounded-lg border bg-card p-4 text-card-foreground">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{cur.copy.date}</span>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">lang=&quot;{cur.code}&quot;</code>
        </div>
        <h3 className="mt-2 text-base font-semibold leading-snug">{cur.copy.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{cur.copy.body}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium tabular-nums">{cur.copy.price}</span>
          <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
            {cur.copy.cta}
          </button>
        </div>
      </article>
    </div>
  );
}
