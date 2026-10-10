import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/catalog/breadcrumb";
import { stats, themes } from "@/lib/catalog";
import { headingFonts } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "目的から探す",
  description: `「フォームの離脱を減らしたい」のような問題文から、効くパターンを逆引き。${stats.themes} テーマ・${stats.goals} の目的。`,
  alternates: { canonical: "/goals" },
};

export default function GoalsPage() {
  const fonts = headingFonts("hub");
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-8 sm:pt-16" style={fonts}>
      <Breadcrumb items={[{ label: "目的" }]} />
      <header className="mt-10 mb-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <h1 className="fade-up text-[length:var(--fs-display)] leading-[1] tracking-[-0.02em] text-fg-1">目的から</h1>
        <p className="fade-up max-w-md text-sm leading-relaxed text-fg-3 lg:justify-self-end" style={{ animationDelay: "120ms" }}>
          作りたいものではなく、解きたい困りごとから引く索引です。{stats.themes} のテーマに {stats.goals} の目的があります。
        </p>
      </header>
      <div className="space-y-20">
        {themes.map((t, ti) => (
          <section key={t.slug} aria-labelledby={`t-${t.slug}`} className="reveal grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="idx text-xs text-fg-3">{String(ti + 1).padStart(2, "0")}</p>
              <h2 id={`t-${t.slug}`} className="mt-2 text-3xl text-fg-1">
                <Link href={`/g/${t.slug}`} className="hover:text-brand">{t.name}</Link>
              </h2>
            </div>
            <ul className="border-t border-line-1">
              {t.goals.map((g, i) => (
                <li key={g.title} className="border-b border-line-1">
                  <Link href={`/g/${t.slug}#g${i}`} className="group flex items-baseline gap-4 py-5 transition-colors hover:bg-bg-1 sm:px-4">
                    <span className="flex-1 text-xl leading-snug text-fg-1 transition-colors group-hover:text-brand sm:text-2xl">{g.title}</span>
                    <span className="shrink-0 font-mono text-xs text-fg-3">{g.patterns.length} 件</span>
                    <ArrowRight className="size-4 shrink-0 self-center text-fg-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
