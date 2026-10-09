"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Truck } from "lucide-react";

const STATS = [
  { v: "60%", k: "問い合わせ対応の工数削減" },
  { v: "3.2倍", k: "1 日あたりの処理件数" },
  { v: "2 週間", k: "現場への定着" },
];

export default function CaseStudy() {
  const [open, setOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (open) headingRef.current?.focus();
    else cardRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <a
        ref={cardRef}
        href="#case-mikan-logistics"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="group mx-auto block w-full max-w-sm overflow-hidden rounded-lg border bg-card outline-none transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex h-24 items-end justify-between bg-muted px-4 pb-3">
          <span className="grid size-10 place-items-center rounded-md bg-background shadow-sm">
            <Truck className="size-5 text-orange-600 dark:text-orange-400" aria-hidden />
          </span>
          <span className="text-xs text-muted-foreground">物流 · 従業員 320 名</span>
        </div>
        <div className="p-4">
          <div className="mb-1 text-xs text-muted-foreground">導入事例 · みかん物流株式会社</div>
          <h3 className="mb-2 font-semibold leading-snug">問い合わせ対応の工数を 60% 削減した、配送状況の自動通知</h3>
          <dl className="mb-3 grid grid-cols-3 gap-2">
            {STATS.map((s) => (
              <div key={s.k} className="flex flex-col-reverse">
                <dt className="text-[10px] leading-tight text-muted-foreground">{s.k}</dt>
                <dd className="text-lg font-semibold tabular-nums">{s.v}</dd>
              </div>
            ))}
          </dl>
          <span className="inline-flex items-center gap-1 text-xs font-medium">
            事例を読む
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </a>
    );
  }

  return (
    <article id="case-mikan-logistics" className="mx-auto w-full max-w-md rounded-lg border bg-card">
      <div className="border-b px-4 py-2">
        <a
          href="#case-list"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" aria-hidden />
          導入事例一覧
        </a>
      </div>
      <div className="max-h-80 space-y-4 overflow-y-auto p-4">
        <header>
          <div className="text-xs text-muted-foreground">みかん物流株式会社 · 2026年9月</div>
          <h3 ref={headingRef} tabIndex={-1} className="mt-1 font-semibold leading-snug outline-none">
            問い合わせ対応の工数を 60% 削減した、配送状況の自動通知
          </h3>
        </header>
        <section>
          <h4 className="mb-1 text-sm font-medium">課題</h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            「荷物はいつ届くのか」という電話が 1 日 400 件を超え、センターの担当者が本来の業務に手を付けられない状態でした。
          </p>
        </section>
        <section>
          <h4 className="mb-1 text-sm font-medium">取り組み</h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            出荷・持ち出し・到着予定の 3 時点で SMS とメールを自動送信。到着時間帯の変更も通知から直接できるようにしました。
          </p>
        </section>
        <blockquote className="rounded-md bg-muted/60 p-3 text-xs leading-relaxed">
          <Quote className="mb-1 size-3.5 text-muted-foreground" aria-hidden />
          電話が鳴らない日が来るとは思っていませんでした。空いた時間で再配達ルートの見直しに取り組めています。
          <footer className="mt-1.5 text-muted-foreground">— カスタマーセンター長 小川 恵</footer>
        </blockquote>
        <section>
          <h4 className="mb-2 text-sm font-medium">成果</h4>
          <dl className="grid grid-cols-3 gap-2">
            {STATS.map((s) => (
              <div key={s.k} className="flex flex-col-reverse rounded-md border p-2">
                <dt className="text-[10px] leading-tight text-muted-foreground">{s.k}</dt>
                <dd className="text-base font-semibold tabular-nums">{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
