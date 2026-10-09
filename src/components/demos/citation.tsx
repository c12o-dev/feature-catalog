"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCES = [
  { n: 1, title: "社内規程 第12条 リモートワーク", site: "wiki.example.jp", quote: "週 3 日まで在宅勤務を認める。申請は前週金曜までに行う。" },
  { n: 2, title: "2026 年度 福利厚生ガイド", site: "hr.example.jp", quote: "在宅勤務手当として月額 5,000 円を給与と併せて支給する。" },
  { n: 3, title: "情報セキュリティ基準 v4.2", site: "sec.example.jp", quote: "社外ネットワークからの接続時は VPN の利用を必須とする。" },
];

type Part = string | number;
const ANSWER: Part[] = [
  "在宅勤務は週 3 日まで可能で、前週の金曜日までに申請が必要です",
  1,
  "。手当として月 5,000 円が支給されます",
  2,
  "。なお、社外から業務システムに接続するときは VPN の利用が必須です",
  3,
  "。",
];

export default function Citation() {
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState<number | null>(null);
  const [peek, setPeek] = useState<number | null>(null);
  const srcId = (n: number) => `${uid}-src-${n}`;

  const jump = (e: React.MouseEvent, n: number) => {
    e.preventDefault();
    setActive(n);
    const el = document.getElementById(srcId(n));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    (el?.querySelector("a") as HTMLElement | null)?.focus({ preventScroll: true });
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-3">
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-violet-600 dark:text-violet-400" aria-hidden />
          社内アシスタントの回答
        </div>
        <p className="text-sm leading-relaxed">
          {ANSWER.map((p, i) =>
            typeof p === "string" ? (
              <span key={i}>{p}</span>
            ) : (
              <span key={i} className="inline-block">
                <a
                  href={`#${srcId(p)}`}
                  aria-label={`出典 ${p}: ${SOURCES[p - 1].title}`}
                  aria-describedby={peek === p ? `${uid}-peek` : undefined}
                  onClick={(e) => jump(e, p)}
                  onMouseEnter={() => setPeek(p)}
                  onMouseLeave={() => setPeek(null)}
                  onFocus={() => setPeek(p)}
                  onBlur={() => setPeek(null)}
                  className={cn(
                    "mx-0.5 inline-grid h-4 min-w-4 -translate-y-1 place-items-center rounded px-1 align-baseline text-[10px] font-semibold tabular-nums",
                    "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:hover:bg-violet-900",
                    active === p && "ring-2 ring-violet-400/60",
                  )}
                >
                  {p}
                </a>
              </span>
            ),
          )}
        </p>
        <div id={`${uid}-peek`} className="mt-3 min-h-10 border-t pt-2 text-xs leading-snug">
          {peek ? (
            <>
              <span className="font-medium">[{peek}] {SOURCES[peek - 1].title}</span>
              <span className="mt-0.5 block text-muted-foreground">「{SOURCES[peek - 1].quote}」</span>
            </>
          ) : (
            <span className="text-muted-foreground">番号にカーソルを合わせると引用箇所を表示、クリックで出典へ移動</span>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-background p-3">
        <div className="mb-2 text-xs font-medium text-muted-foreground">出典</div>
        <ol className="space-y-1">
          {SOURCES.map((s) => (
            <li
              key={s.n}
              id={srcId(s.n)}
              className={cn(
                "rounded-md p-2 transition-colors",
                active === s.n ? "bg-violet-50 dark:bg-violet-950/40" : "hover:bg-muted/60",
              )}
            >
              <a
                href={`#${srcId(s.n)}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(s.n);
                }}
                className="group flex items-start gap-2 rounded-sm text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span className="mt-px grid size-4 shrink-0 place-items-center rounded bg-muted text-[10px] font-semibold tabular-nums">
                  {s.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 font-medium group-hover:underline">
                    <span className="truncate">{s.title}</span>
                    <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" aria-hidden />
                  </span>
                  <span className="block text-xs text-muted-foreground">{s.site}</span>
                  {active === s.n && <span className="mt-1 block text-xs text-muted-foreground">「{s.quote}」</span>}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
