"use client";

import { useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { lvl: 1, t: "はじめに", body: "本書は新しい通知基盤の設計方針をまとめたものです。対象読者はバックエンドとモバイルの開発者です。" },
  { lvl: 2, t: "背景", body: "現行の通知はサービスごとに実装が分かれており、配信遅延や重複送信が月に数件発生しています。" },
  { lvl: 2, t: "目的", body: "配信経路を一本化し、再送・重複排除・ユーザー設定の反映を共通化します。" },
  { lvl: 1, t: "設計", body: "通知はイベントとして受け取り、キューを経由して各チャネルへ配信します。" },
  { lvl: 2, t: "全体像", body: "受付 API、ルーティング、チャネル別ワーカーの 3 層で構成します。" },
  { lvl: 3, t: "データフロー", body: "イベントは ID で冪等に処理し、配信結果を 30 日間保存します。" },
  { lvl: 3, t: "セキュリティ", body: "本文に個人情報を含めず、端末側でテンプレートに差し込みます。" },
  { lvl: 1, t: "移行計画", body: "11 月から段階的に切り替え、旧基盤は 2027 年 1 月に停止します。" },
];

export default function OutlinePanel() {
  const reduce = useReducedMotion();
  const base = useId();
  const pane = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = pane.current;
    if (!el) return;
    const top = el.scrollTop + 8;
    let current = 0;
    SECTIONS.forEach((_, i) => {
      const h = document.getElementById(`${base}-s${i}`);
      if (h && h.offsetTop <= top) current = i;
    });
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) current = SECTIONS.length - 1;
    setActive(current);
  };

  const jump = (i: number) => {
    const el = pane.current;
    const h = document.getElementById(`${base}-s${i}`);
    if (!el || !h) return;
    el.scrollTo({ top: h.offsetTop, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
    h.focus({ preventScroll: true });
  };

  return (
    <div className="@container w-full overflow-hidden rounded-lg border bg-card">
      <div className="grid @md:grid-cols-[11rem_1fr]">
        <nav aria-label="目次" className="border-b p-3 @md:border-b-0 @md:border-r">
          <div className="mb-2 text-xs font-medium text-muted-foreground">目次</div>
          <ol className="max-h-28 space-y-0.5 overflow-y-auto text-sm @md:max-h-none">
            {SECTIONS.map((s, i) => (
              <li key={s.t}>
                <a
                  href={`#${base}-s${i}`}
                  onClick={(e) => {
                    e.preventDefault();
                    jump(i);
                  }}
                  aria-current={active === i ? "location" : undefined}
                  className={cn(
                    "block truncate rounded border-l-2 py-0.5 pr-1 text-xs transition-colors hover:text-foreground",
                    active === i ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground",
                  )}
                  style={{ paddingLeft: 6 + (s.lvl - 1) * 12 }}
                >
                  {s.t}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div ref={pane} onScroll={onScroll} className="relative h-64 overflow-y-auto p-4" tabIndex={0} aria-label="本文">
          {SECTIONS.map((s, i) => {
            const Tag = s.lvl === 1 ? "h3" : s.lvl === 2 ? "h4" : "h5";
            return (
              <section key={s.t} className="mb-4">
                <Tag
                  id={`${base}-s${i}`}
                  tabIndex={-1}
                  className={cn("mb-1 scroll-mt-2 outline-none", s.lvl === 1 ? "text-sm font-semibold" : s.lvl === 2 ? "text-sm font-medium" : "text-xs font-medium")}
                >
                  {s.t}
                </Tag>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              </section>
            );
          })}
          <div className="h-24" aria-hidden />
        </div>
      </div>
    </div>
  );
}
