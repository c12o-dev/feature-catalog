"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const sections = [
  { id: "intro", title: "はじめに", body: "このガイドでは、Kumo CLI のセットアップから日常的な使い方までを順に説明します。所要時間はおよそ 10 分です。" },
  { id: "install", title: "インストール", body: "パッケージマネージャから kumo をインストールし、kumo login でアカウントを紐付けます。社内プロキシ環境では環境変数 HTTPS_PROXY を設定してください。" },
  { id: "usage", title: "基本的な使い方", body: "kumo init でプロジェクトを作成し、kumo deploy で公開します。デプロイ履歴は kumo log で確認できます。" },
  { id: "advanced", title: "高度な機能", body: "プレビュー環境、ロールバック、環境ごとのシークレット管理に対応しています。設定は kumo.toml にまとめて記述します。" },
  { id: "faq", title: "よくある質問", body: "Q. 無料プランでも使えますか? — はい、月 100 回までのデプロイは無料です。Q. Windows に対応していますか? — はい。" },
];

export default function AnchorToc() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(sections[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const onScroll = () => {
      const top = root.getBoundingClientRect().top;
      let current = sections[0].id;
      for (const s of sections) {
        const el = root.querySelector<HTMLElement>(`[data-section="${s.id}"]`);
        if (el && el.getBoundingClientRect().top - top <= 24) current = s.id;
      }
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 2) current = sections[sections.length - 1].id;
      setActive(current);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const root = scrollRef.current;
    const el = root?.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (!root || !el) return;
    root.scrollTo({ top: el.offsetTop - 12, behavior: reduce ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  };

  return (
    <div className="grid h-72 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 sm:grid-cols-[1fr_11rem] sm:grid-rows-1">
      <nav aria-label="このページの目次" className="order-first sm:order-last sm:border-l sm:pl-3">
        <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">このページの内容</div>
        <ul className="flex gap-1 overflow-x-auto text-xs sm:block sm:space-y-0.5">
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => jump(e, s.id)}
                  className={`block whitespace-nowrap rounded-md px-2 py-1 transition-colors sm:-ml-3 sm:rounded-none sm:border-l-2 sm:pl-3 ${on ? "bg-accent font-medium text-foreground sm:border-primary sm:bg-transparent" : "text-muted-foreground hover:text-foreground sm:border-transparent"}`}
                >
                  {s.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div ref={scrollRef} role="region" aria-label="本文" tabIndex={0} className="relative min-h-0 space-y-5 overflow-y-auto rounded-lg border bg-card p-4">
        {sections.map((s) => (
          <section key={s.id} data-section={s.id} tabIndex={-1} aria-labelledby={`toc-${s.id}`} className="outline-none">
            <h3 id={`toc-${s.id}`} className="text-sm font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
